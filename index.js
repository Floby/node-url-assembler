module.exports = UrlAssembler;

function UrlAssembler (_template) {
  if(!(this instanceof UrlAssembler)) return new UrlAssembler(_template);
  if(!_template) throw new Error('template parameter is mandatory');
  var template = _template;

  this.prefix = function (prefix) {
    template = prefix + template;
    return this;
  };
  this.toString = function () {
    return template;
  };
}

