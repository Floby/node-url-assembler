module.exports = UrlAssembler;

function UrlAssembler (template) {
  if(!(this instanceof UrlAssembler)) return new UrlAssembler(template);
  if(!template) throw new Error('template parameter is mandatory');

  this.toString = function () {
    return template;
  }
}

