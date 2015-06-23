
var urlFieldsToKeep = [
  'protocol',
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
  'href'
];

module.exports = function selectUrlFields (assembler) {
  return urlFieldsToKeep.reduce(function(value, field) {
    value[field] = assembler[field]
    return value;
  }, {})
}
