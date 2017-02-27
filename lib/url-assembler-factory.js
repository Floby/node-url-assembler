var extend = require('extend');
var url = require('url');
var qs = require('qs');
var selectUrlFields = require('./fields-to-keep');

module.exports = function (request) {

  function UrlAssembler (baseUrlOrUrlAssembler) {
    if(!(this instanceof UrlAssembler)) {
      return new UrlAssembler(baseUrlOrUrlAssembler);
    }

    var query = {};
    this._query = addQueryParamTo(query);
    this._prefix = '';
    this.pathname = '';
    this.getParsedQuery = clone.bind(null, query);

    Object.defineProperty(this, '_requestModule', { value: request, writable: true });

    if (baseUrlOrUrlAssembler instanceof UrlAssembler) {
      initWithInstance(this, baseUrlOrUrlAssembler);
    } else if (baseUrlOrUrlAssembler) {
      initWithBaseUrl(this, baseUrlOrUrlAssembler);
    }
  }

  function initWithBaseUrl (self, baseUrl) {
    extend(self, selectUrlFields(url.parse(baseUrl)));
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
    self._requestModule = instance._requestModule;
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
  };

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
    if (typeof key === 'object') {
      return _multiParam(this, key, (value === true));
    }
    var chainable = this._chain();
    var previous = this.pathname;
    var symbol = ':' + key;
    chainable.pathname = this.pathname.replace(symbol, value);
    if (!strict && chainable.pathname === previous) {
      return chainable.query(key, value);
    }
    return chainable;
  };

  function _multiParam (chainable, hash, strict) {
    for (key in hash) {
      chainable = chainable.param(key, hash[key], strict);
    }
    return chainable;
  }

  function addQueryParamTo (query) {
    return function addQueryParam(key, value) {
      if(!value && typeof key === 'object') {
        addManyParameters(key);
      } else {
        addOneParameter(key, value)
      }
      this.search = qs.stringify(query);
    }

    function addManyParameters (hash) {
      for (var key in hash) {
        if (nullOrUndef(hash[key])) delete hash[key];
      }
      extend(true, query, hash);
    }

    function addOneParameter (key, value) {
      if (!nullOrUndef(value)) {
        query[key] = value;
      }
    }
  }

  Object.defineProperty(UrlAssembler.prototype, 'request', {
    get: function () {
      var request = this._requestModule;
      if (request) {
        return request.defaults({ uri: this.toString() });
      } else {
        throw Error('the "request" module was not found. You must have it installed to use this property');
      }
    },
    set: function (newRequest) {
      return this._requestModule = newRequest;
    }
  });

  function nullOrUndef (value) {
    return value === null || typeof value === 'undefined';
  }

  function clone (obj) {
    return extend(true, {}, obj);
  }
  return UrlAssembler;
}
