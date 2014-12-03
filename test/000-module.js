var expect = require('chai').expect

describe('the module', function () {
  it('is requirable', function () {
    require('../');
  });
  it('is a function', function () {
    expect(require('../')).to.be.a('function');
  });

  it('is a constructor without new', function () {
    var UrlAssembler = require('../');
    var myUrl = UrlAssembler('/hello');
    expect(myUrl).to.be.an.instanceof(UrlAssembler);
  });

  describe('when called without parameters', function () {
    var UrlAssembler = require('../');
    it('throws', function () {
      expect(function () {
        UrlAssembler()
      }).to.throw(/mandatory/)
    })
  })
})
