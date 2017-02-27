var expect = require('chai').expect
var UrlAssembler = require('../')

describe('an instance with a baseUrl', function () {
  var myUrl;
  beforeEach(function () {
    myUrl = UrlAssembler('http://hello.com:8989/api');
  });

  describe('With no template', function () {
    describe('.query(key, value)', function () {
      it('add the query parameter directly after a /', function () {
        expect(myUrl.query('hello', 'world').toString()).to.equal('http://hello.com:8989/api?hello=world');
      });
    });
  });

  describe('given a template with no parameters', function () {
    beforeEach(function () {
      myUrl = myUrl.template('/hello/world');
    });

    it('adds it to the pathname of the url', function () {
      expect(myUrl.toString()).to.equal('http://hello.com:8989/api/hello/world')
    });

    describe('.prefix(prefix)', function () {
      it('adds a prefix in addition to the exsting one', function () {
        expect(myUrl.prefix('/v2').toString()).to.equal('http://hello.com:8989/api/v2/hello/world');
      })
    })
  });

  describe('when the baseUrl stops at the port number', function () {
    beforeEach(function () {
      myUrl = UrlAssembler('http://domain.com:90');
    })

    it('does not double slash the result', function () {
      expect(myUrl.segment('/hello').toString()).to.equal('http://domain.com:90/hello');
    })
  });

  describe('when passed to url.format', function () {
    beforeEach(function () {
      myUrl = myUrl.prefix('/v4').segment('/users/:user').segment('/rights');
    });
    it('should give the same output as toString()', function () {
      var url = require('url');
      myUrl.param('user', 'floby');
      var expected = myUrl.toString();
      expect(url.format(myUrl)).to.equal(expected);
    });
  })

});
