var expect = require('chai').expect
var UrlAssembler = require('../')

describe('an instance with no baseUrl', function () {
  var myUrl;
  beforeEach(function () {
    myUrl = UrlAssembler();
  });

  describe('given no template', function () {
    describe('.prefix(prefix)', function () {
      it('should add the given prefix at the beginning of the URL', function () {
        expect(myUrl.prefix('/hello').toString()).to.equal('/hello');
      });
    });
  });

  describe('given a template with no parameters', function () {
    beforeEach(function () {
      myUrl = myUrl.template('/hello');
    });
    describe('.toString()', function () {
      it('returns the template', function () {
        expect(myUrl.toString()).to.equal('/hello');
      });
    });

    describe('.valueOf()', function () {
      it('returns the template', function () {
        expect(myUrl.valueOf()).to.equal('/hello');
      })
    });

    describe('.toJSON()', function () {
      it('returns the assembled string', function () {
        expect(myUrl.toJSON()).to.equal(myUrl.toString());
      });
    });

    describe('.prefix(prefix)', function () {
      it('adds a prefix to the result of toString()', function () {
        expect(myUrl.prefix('/coucou').toString()).to.equal('/coucou/hello');
      });
    });

    describe('.param(key, value)', function () {
      it('adds the parameter as a query parameter', function () {
        expect(myUrl.param('a', 'bc').toString()).to.equal('/hello?a=bc');
      });
    });

    describe('.param(key, value, true)', function () {
      it('does not add the parameter as query parameter', function () {
        expect(myUrl.param('a', 'bc', true).toString()).to.equal('/hello');
      });
    });

    describe('.query(key, value)', function () {
      it('add the parameter as a query parameter', function () {
        expect(myUrl.query('param', 12345).toString()).to.equal('/hello?param=12345');
      })

      it('does not add the query parameter if it has a null value', function () {
        expect(myUrl.query('param', null).toString()).to.equal('/hello');
      })

      it('keeps the query parameter if it has a falsy yet correct value', function () {
        expect(myUrl.query('param', 0).toString()).to.equal('/hello?param=0');
      });
    });

    describe('.query({key: value})', function () {
      it('adds each of it to the query string', function () {
        myUrl = myUrl.query({
          'hello': 'goodbye',
          'one': 1
        })
        expect(myUrl.toString()).to.equal('/hello?hello=goodbye&one=1');
      })

      it('does not add the query parameters which are null', function () {
        myUrl = myUrl.query({
          'hello': 'goodbye',
          'one': null,
          'goodbye': 'hello'
        })
        expect(myUrl.toString()).to.equal('/hello?hello=goodbye&goodbye=hello');
      });

      it('keeps falsy values if they are correct', function () {
        myUrl = myUrl.query({
          'hello': 'goodbye',
          'two': '',
          'three': 0,
          'goodbye': 'hello'
        })
        expect(myUrl.toString()).to.equal('/hello?hello=goodbye&two=&three=0&goodbye=hello');
      });

      describe('when some query param have already been set', function () {
        beforeEach(function () {
          myUrl = myUrl.query('yes', 'no');
        })
        it('keeps the previously set query params', function () {
          myUrl = myUrl.query({
            'hello': 'goodbye',
            'one': 1
          })
          expect(myUrl.toString()).to.equal('/hello?yes=no&hello=goodbye&one=1')
        });
      })
    })
  });

  describe('given a template with a simple parameter', function () {
    beforeEach(function () {
      myUrl = UrlAssembler('/path/:myparam');
    });
    describe('.param(key, value)', function () {
      it('replaces the parameter in the template', function () {
        expect(myUrl.param('myparam', 'hello').toString()).to.equal('/path/hello');
      })
    });

    describe('.segment(subpath)', function () {
      beforeEach(function () {
        myUrl = myUrl
          .param('myparam', 'hello')
          .segment('/another/:parameter');
      })
      it('adds the given parametrized segment at the end of the path', function () {
        expect(myUrl.param('parameter', 8000).toString()).to.equal('/path/hello/another/8000');
      });
    });
  });

  describe('given segments with multiple parameters', function () {
    beforeEach(function () {
      myUrl = myUrl
      .segment('/groups/:group')
      .segment('/users/:user');
    })
    describe('.param({...})', function () {
      it('replace the correct value for each parameter', function () {
        var actual = myUrl.param({
          group: 'A',
          user: 9
        }).toString();
        expect(actual).to.equal('/groups/A/users/9');
      });

      it('puts parameters which are not substituted in the path to query params', function () {
        var actual = myUrl.param({
          group: 'A',
          user: 9,
          something: 'else'
        }).toString();
        expect(actual).to.equal('/groups/A/users/9?something=else');
      });
    })

    describe('.param({...}, true)', function () {
      it('does not put unused parameters in query params', function () {
        var actual = myUrl.param({
          group: 'A',
          user: 9,
          something: 'else'
        }, true).toString();
        expect(actual).to.equal('/groups/A/users/9');
      });
    });

  });
});
