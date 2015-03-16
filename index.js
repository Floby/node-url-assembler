var extend = require('extend');
var url = require('url');
var qs = require('qs');

module.exports = UrlAssembler;

function UrlAssembler (baseUrlOrParams) {
  if(!(this instanceof UrlAssembler)) return new UrlAssembler(baseUrlOrParams);

  var baseUrl = typeof baseUrlOrParams === 'string' ? baseUrlOrParams : null;
  var params = typeof baseUrlOrParams === 'object' ? baseUrlOrParams : null;

  var query = {};
  this._prefix = '';

  this._query = function addQueryParam (key, value) {
    if(!value && typeof key === 'object') {
      for (var i in key) {
        if (nullOrUndef(key[i]))
          delete key[i];
      }
      query = extend(query, key);
    }
    else if (!nullOrUndef(value)) {
      query[key] = value;
    }
    this.search = qs.stringify(query);
  }

  this._chain = function () {
    return new UrlAssembler({
      value: selectUrlFields(this),
      prefix: this._prefix,
      query: query
    });
  };

  if(baseUrl) {
    extend(this, url.parse(baseUrl));
    this._prefix = this.pathname;
    if(this._prefix === '/') {
      this._prefix = '';
      this.pathname = '';
    }
  }
  if(params) {
    extend(this, params.value);
    this._prefix = params.prefix;
    this._query(params.query);
  }

}

var methods = UrlAssembler.prototype;

methods.template = function (fragment) {
  this.pathname = (this._prefix) + fragment;
  return this._chain();
};

methods.segment = function (segment) {
  this.pathname = (this.pathname || '') + segment;
  return this._chain();
}

methods.toString = function toString () {
  return url.format(this);
};

methods.valueOf = function () {
  return this.toString();
}

methods.query = function (param, value) {
  this._query(param, value);
  return this._chain();
};

methods.prefix = function prefix (prefix) {
  var pathToKeep = this.pathname.substr(this._prefix.length);
  this._prefix = this._prefix + prefix;
  this.pathname = this._prefix + pathToKeep;
  return this._chain();
};

methods.param = function param (key, value) {
  if(!value && typeof key === 'object') {
    var hash = key;
    for(key in hash) {
      this.param(key, hash[key]);
    }
    return this._chain();
  }

  var previous = this.pathname;
  var symbol = ':' + key;
  this.pathname = this.pathname.replace(symbol, value);
  if(this.pathname === previous) {
    this.query(key, value);
  }
  return this._chain();
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
