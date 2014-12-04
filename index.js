var extend = require('extend');
var url = require('url');
var qs = require('qs');

module.exports = UrlAssembler;

function UrlAssembler (template) {
  if(!(this instanceof UrlAssembler)) return new UrlAssembler(template);
  if(!template) throw new Error('template parameter is mandatory');

  extend(this, url.parse(template));

  var query = {};
  this.search = null;
  this.query = function addQueryParam (key, value) {
    query[key] = value;
    var search = qs.stringify(query);
    if(search) search = '?' + search;
    this.search = search;
    return this;
  }
}

var m = UrlAssembler.prototype;

m.toString = function toString () {
  return url.format(this);
};

m.prefix = function prefix (prefix) {
  this.pathname = prefix + this.pathname;
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
