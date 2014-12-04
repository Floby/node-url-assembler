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

    describe('.prefix()', function () {
      it('adds a prefix to the result of toString()', function () {
        expect(myUrl.prefix('/coucou').toString()).to.equal('/coucou/hello');
      });
    });

    describe('.param()', function () {
      it('adds the parameter as a query parameter', function () {
        expect(myUrl.param('a', 'bc').toString()).to.equal('/hello?a=bc');
      });
    });
  });

  describe('given a template with a simple parameter', function () {
    beforeEach(function () {
      myUrl = UrlAssembler('/path/:myparam');
    })
    describe('.param()', function () {
      it('replaces the parameter in the template', function () {
        expect(myUrl.param('myparam', 'hello').toString()).to.equal('/path/hello');
      })
    });
  });
});
