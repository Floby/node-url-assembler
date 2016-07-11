var expect = require('chai').expect;
var UrlAssembler = require('../');

describe('an instance with a baseUrl', function () {
  var myUrl;
  beforeEach(function () {
    myUrl = UrlAssembler('http://hello.com:8989/api');
  });

  describe('given a template with no parameters', function () {
    beforeEach(function () {
      myUrl = myUrl.template('/hello/world');
    });

    it('adds it to the pathname of the url', function () {
      expect(myUrl.toString()).to.equal('http://hello.com:8989/api/hello/world')
    });

    describe('.prefix(prefix)', function () {
      it('adds a prefix in addition to the existing one', function () {
        expect(myUrl.prefix('/v2').toString()).to.equal('http://hello.com:8989/api/v2/hello/world');
      })
    })
  });

  describe('when the baseUrl stops at the port number', function () {
    beforeEach(function () {
      myUrl = UrlAssembler('http://domain.com:90');
    });

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
  });

  describe('when used with special characters', function() {

    it('should encode them in the final URL (with template)', function() {
      myUrl = UrlAssembler('http://www.canal.com:8989')
        .prefix('/plûs')
        .template('/:zone/média/:média')
        .param({média: 'Bouquet père', zone: 'CARAÏBES'})
        .query({now: '2014-05-27T03:59:59+00:00', föö: "b a r"});
      expect(myUrl.toString()).to.equal(
        'http://www.canal.com:8989'
        + '/pl%C3%BBs'
        + '/CARA%C3%8FBES/m%C3%A9dia/Bouquet%20p%C3%A8re'
        + '?now=2014-05-27T03%3A59%3A59%2B00%3A00&f%C3%B6%C3%B6=b+a+r'
      );
    });

    it('should encode them in the final URL (with segment)', function() {
      myUrl = UrlAssembler('http://www.canal.com:8989')
          .prefix('/plûs')
          .segment('/:zone/média/:média')
          .param({média: 'Bouquet père', zone: 'CARAÏBES'})
          .query({now: '2014-05-27T03:59:59+00:00', föö: "b a r"});
      expect(myUrl.toString()).to.equal(
          'http://www.canal.com:8989'
          + '/pl%C3%BBs'
          + '/CARA%C3%8FBES/m%C3%A9dia/Bouquet%20p%C3%A8re'
          + '?now=2014-05-27T03%3A59%3A59%2B00%3A00&f%C3%B6%C3%B6=b+a+r'
      );
    });

  })

});
