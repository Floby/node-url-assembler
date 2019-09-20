var expect = require('chai').expect
var UrlAssembler = require('../')
var Url = require('url')

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

  describe('when baseUrl has a query param', function () {
    beforeEach(function () {
      myUrl = UrlAssembler('http://domain.com/coucou?hello=world');
    });

    it('should keep the query param', function () {
      expect(myUrl.query('a', 'b').toString()).to.equal('http://domain.com/coucou?hello=world&a=b');
    });

  });

  describe("when baseUrl has a repeated query param with config", function() {
    beforeEach(function() {
      myUrl = UrlAssembler("http://domain.com/coucou?hello=world");
    });

    it("should keep accept qs config options", function() {
      expect(
        myUrl
          .qsConfig({
            arrayFormat: "repeat"
          })
          .query("a", ["b", "c"])
          .toString()
      ).to.equal("http://domain.com/coucou?hello=world&a=b&a=c");
    });
  });

  describe('when used with special characters', function() {

    it('should encode them in the final URL (with template)', function() {
      var expected = 'http://www.canal.com:8989'
        + '/pl%C3%BBs'
        + '/CARA%C3%8FBES/m%C3%A9dia/Bouquet%20p%C3%A8re'
        + '?now=2014-05-27T03%3A59%3A59%2B00%3A00&f%C3%B6%C3%B6=b%20a%20r'
      myUrl = UrlAssembler('http://www.canal.com:8989')
        .prefix('/plûs')
        .template('/:zone/média/:media')
        .param({'media': 'Bouquet père', 'zone': 'CARAÏBES'})
        .query({now: '2014-05-27T03:59:59+00:00', föö: "b a r"});
      expect(myUrl.toString()).to.equal(expected);
      expect(Url.format(myUrl)).to.equal(expected)
    });

    it('should encode them in the final URL (with segment)', function() {
      var expected = 'http://www.canal.com:8989'
          + '/pl%C3%BBs'
          + '/CARA%C3%8FBES/m%C3%A9dia/Bouquet%20p%C3%A8re'
          + '?now=2014-05-27T03%3A59%3A59%2B00%3A00&f%C3%B6%C3%B6=b%20a%20r'
      myUrl = UrlAssembler('http://www.canal.com:8989')
          .prefix('/plûs')
          .segment('/:zone/média/:media')
          .param({'media': 'Bouquet père', 'zone': 'CARAÏBES'})
          .query({now: '2014-05-27T03:59:59+00:00', föö: "b a r"});
      expect(myUrl.toString()).to.equal(expected);
      expect(Url.format(myUrl)).to.equal(expected)
    });

    it('should encode them in the final URL (with param)', function() {
      var expected = 'http://example.com'
          + "/search/-_.!~*'()%20%2F%3B%2C%3F%3A%40%26%3D%2B%24_abc_%E6%97%A5%E6%9C%AC%E8%AA%9E"
      myUrl = UrlAssembler('http://example.com')
          .segment('/search/:p')
          .param({
            'p': "-_.!~*'() /;,?:@&=+$_abc_日本語"
          });
      expect(myUrl.toString()).to.equal(expected);
      expect(Url.format(myUrl)).to.equal(expected)
    });
  });

});
