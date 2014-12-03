var expect = require('chai').expect
var UrlAssembler = require('../')

describe('an instance', function () {
  var myUrl;

  describe('given a template with no parameters', function () {
    beforeEach(function () {
      myUrl = UrlAssembler('/hello');
    });
    describe('.toString()', function () {
      it('returns the template', function () {
        expect(myUrl.toString()).to.equal('/hello');
      });
    })
  });
});
