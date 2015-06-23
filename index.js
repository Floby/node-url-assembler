var request;
try {
  request = require('request');
} catch(e) {}
module.exports = require('./lib/url-assembler-factory')(request)
