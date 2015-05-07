var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();
var expect = require('chai').expect
var assert = require('chai').assert

describe('if the request module is found', function () {
  var requestMock, UrlAssembler;
  var myUrl, defaulted;
  beforeEach(function () {
    defaulted = {};
    requestMock = {
      defaults: sinon.stub().returns(defaulted)
    };
    UrlAssembler = proxyquire('../', { request: requestMock });
    myUrl = UrlAssembler('http://some.thing/hello');
  })

  describe('an instance', function () {
    it('has a "request" property', function () {
      expect(myUrl).to.have.property('request');
    })

    describe('the .request property', function () {
      it('returns a request object which defaults to the current URL', function () {
        expect(myUrl.request).to.equal(defaulted);
        assert(requestMock.defaults.calledWith({ uri: 'http://some.thing/hello' }));
      });

      it('can be set to an already defaulted version of request', function () {
        var myRequest = {defaults: sinon.stub().returns(defaulted)};
        myUrl.request = myRequest;
        expect(myUrl.request).to.equal(defaulted);
        assert(myRequest.defaults.calledWith({ uri: 'http://some.thing/hello' }), 'defaults are not reused');
      });

      describe('on an child instance', function () {
        it('uses the same defaults as its parent', function () {
        var myRequest = {defaults: sinon.stub().returns(defaulted)};
        //var myRequest = {coucu: 8};
        myUrl.request = myRequest;
        expect(myUrl.segment('/something').request).to.equal(defaulted);
        assert(myRequest.defaults.calledWith({ uri: 'http://some.thing/hello/something' }), 'defaults are not reused');
        });
      });
    });

  });
});

describe('if the request module is NOT found', function () {
  var UrlAssembler = proxyquire('../', { request: null });

  describe('an instance', function () {
    var myUrl = UrlAssembler('http://some.thing/hello');
    it('throws when trying to access the .request property', function () {
      expect(function () {
        myUrl.request
      }).to.throw(Error);
    })
  });
});
