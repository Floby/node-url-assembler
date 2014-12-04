var qs = require('qs');

module.exports = UrlAssembler;

function UrlAssembler (_template) {
  if(!(this instanceof UrlAssembler)) return new UrlAssembler(_template);
  if(!_template) throw new Error('template parameter is mandatory');
  var template = _template;
  var query = {};

  this.param = function (key, value) {
    var symbol = ':' + key;
    previous = template;
    template = template.replace(symbol, value);
    if(previous === template) {
      query[key] = value
    }
    return this;
  }
  this.prefix = function (prefix) {
    template = prefix + template;
    return this;
  };
  this.toString = function () {
    var q = qs.stringify(query);
    if(q) q = '?' + q;
    return template + q
  };
}

