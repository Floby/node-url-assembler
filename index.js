var extend = require('extend');
var url = require('url');
var qs = require('qs');

module.exports = UrlAssembler;

function UrlAssembler (baseUrl) {
  if(!(this instanceof UrlAssembler)) return new UrlAssembler(baseUrl);

  if(baseUrl) {
    extend(this, url.parse(baseUrl));
  }

  var query = {};
  this.query = function addQueryParam (key, value) {
    query[key] = value;
    this.search = qs.stringify(query);
    return this;
  }
  this.port = function (newPort) {
    this.host = this.hostname + ':' + newPort;
    return this;
  };
}

var m = UrlAssembler.prototype;

m.template = function (fragment) {
  this.pathname = fragment;
};

m.toString = function toString () {
  return url.format(this);
};

m.prefix = function prefix (prefix) {
  var self = this;
  var pathname = self.pathname
  pathname = prefix + pathname;
  pathname = url.parse(pathname);
  ['pathname', 'protocol', 'hostname'].forEach(function (key) {
    self[key] = pathname[key] || self[key];
  });
  return self;
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
