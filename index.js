var extend = require('extend');
var url = require('url');
var qs = require('qs');

module.exports = UrlAssembler;

function UrlAssembler (baseUrlOrUrlAssembler) {
  if(!(this instanceof UrlAssembler)) return new UrlAssembler(baseUrlOrUrlAssembler);

  this._prefix = '';
  this.pathname = '';
  var query = {};
  this.getParsedQuery = clone.bind(null, query);

  this._query = function addQueryParam (key, value) {
    if(!value && typeof key === 'object') {
      for (var i in key) {
        if (nullOrUndef(key[i])) delete key[i];
      }
      query = extend(query, key);
    }
    else if (!nullOrUndef(value)) {
      query[key] = value;
    }
    this.search = qs.stringify(query);
  }

  if (baseUrlOrUrlAssembler instanceof UrlAssembler) {
    initWithInstance(this, baseUrlOrUrlAssembler);
  } else if (baseUrlOrUrlAssembler) {
    initWithBaseUrl(this, baseUrlOrUrlAssembler);
  }

  this.href = this.toString();
}

function initWithBaseUrl (self, baseUrl) {
  extend(self, url.parse(baseUrl));
  self._prefix = self.pathname;
  if(self._prefix === '/') {
    self._prefix = '';
    self.pathname = '';
  }
}

function initWithInstance (self, instance) {
  extend(self, selectUrlFields(instance));
  self._prefix = instance._prefix;
  self._query(instance.getParsedQuery());
}

var methods = UrlAssembler.prototype;

methods._chain = function () {
  return new this.constructor(this);
};

methods.template = function (fragment) {
  var chainable = this._chain();
  chainable.pathname = this._prefix + fragment;
  return chainable;
};

methods.segment = function (segment) {
  var chainable = this._chain();
  chainable.pathname = this.pathname + segment;
  return chainable;
}

methods.toString = function toString () {
  return url.format(this);
};
methods.valueOf = methods.toString;
methods.toJSON = methods.toString;

methods.query = function (param, value) {
  var chainable = this._chain();
  chainable._query(param, value);
  return chainable;
};

methods.prefix = function prefix (prefix) {
  var chainable = this._chain();
  var pathToKeep = this.pathname.substr(this._prefix.length);
  chainable._prefix = this._prefix + prefix;
  chainable.pathname = chainable._prefix + pathToKeep;
  return chainable;
};

methods.param = function param (key, value, strict) {
  var chainable = this._chain();

  if (typeof key === 'object') {
    var hash = key;
    strict = (value === true);
    for (key in hash) {
      chainable = chainable.param(key, hash[key], strict);
    }
    return chainable;
  }

  var previous = this.pathname;
  var symbol = ':' + key;
  chainable.pathname = this.pathname.replace(symbol, value);
  if (!strict && chainable.pathname === previous) {
    return chainable.query(key, value);
  }
  return chainable;
};

function nullOrUndef (value) {
  return value === null || typeof value === 'undefined';
}

function selectUrlFields (assembler) {
  return ['protocol',
          'slashes',
          'auth',
          'host',
          'port',
          'hostname',
          'hash',
          'search',
          //'query',
          'pathname',
          'path',
          'href'].reduce(function(value, field) {
    value[field] = assembler[field]
    return value;
  }, {})
}

function clone (obj) {
  return extend(true, {}, obj);
}
