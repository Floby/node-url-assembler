var extend = require('extend');
var url = require('url');
var qs = require('qs');

module.exports = UrlAssembler;

function UrlAssembler (baseUrl) {
  if(!(this instanceof UrlAssembler)) return new UrlAssembler(baseUrl);

  this._prefix = '';
  if(baseUrl) {
    extend(this, url.parse(baseUrl));
    this._prefix = this.pathname;
  }

  var query = {};
  this.query = function addQueryParam (key, value) {
    query[key] = value;
    this.search = qs.stringify(query);
    return this;
  }
}

var m = UrlAssembler.prototype;

m.template = function (fragment) {
  this.pathname = (this._prefix) + fragment;
};

m.segment = function (segment) {
  this.pathname = this.pathname + segment;
}

m.toString = function toString () {
  return url.format(this);
};

m.prefix = function prefix (prefix) {
  var pathToKeep = this.pathname.substr(this._prefix.length);
  this._prefix = this._prefix + prefix;
  this.pathname = this._prefix + pathToKeep;
  return this;
};

m.param = function param (key, value) {
  var previous = this.pathname;
  var symbol = ':' + key;
  this.pathname = this.pathname.replace(symbol, value);
  if(this.pathname === previous) {
    this.query(key, value);
  }
  return this;
};
