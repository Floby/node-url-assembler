var expect = require('chai').expect
var UrlAssembler = require('../')

describe('an instance with a baseUrl', function () {
  var myUrl;
  beforeEach(function () {
    myUrl = UrlAssembler('http://hello.com:8989/api');
  });

  describe('given a template with no parameters', function () {
    beforeEach(function () {
      myUrl.template('/hello/world');
    });

    it('adds it to the pathname of the url', function () {
      expect(myUrl.toString()).to.equal('http://hello.com:8989/api/hello/world')
    });

    describe('.prefix()', function () {
      it('adds a prefix in addition to the exsting one', function () {
        expect(myUrl.prefix('/v2').toString()).to.equal('http://hello.com:8989/api/v2/hello/world');
      })
    })
  });

});
