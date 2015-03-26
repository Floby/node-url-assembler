[![Build Status][travis-image]][travis-url] [![Coverage][coveralls-image]][coveralls-url]

node-url-assembler
==================

> Assemble urls from route-like templates (/path/:param) 

Chainable utility to assemble URLs from templates

Installation
------------

    npm install --save url-assembler

Usage
-----

#### Basic

```javascript
UrlAssembler()
  .template('/users/:user')
  .param('user', 8)
  .param('include', 'address')
  .query({
    some: 'thing',
    other: 1234
  })
  .toString() // => "/users/8?include=address&some=thing&other=1234
```

#### With base URL

Since you more often than not need a hostname and a protocol to go with this

```javascript
UrlAssembler('http://my.domain.com:9000')
  .template('/groups/:group/users/:user')
  .param({
    group: 'admin',
    user: 'floby'
  })
  .toString() // => "http://my.domain.9000/groups/admins/users/floby"
```

#### Incremental assembling

You can also incrementally build your URL.

```javascript
UrlAssembler('https://api.site.com/')
  .prefix('/v2')
  .segment('/users/:user')
  .segment('/projects/:project')
  .segment('/summary')
  .param({
    user: 'floby',
    project: 'node-url-assembler'
  })
  .toString() // => 'https://api.site.com/v2/users/floby/projects/node-url-assembler/summary'
```

Design
------

Every method (except `toString()`) returns a new instance of `UrlAssembler`. You can
consider that `UrlAssembler` instances are immutable.

In addition, an instance of `UrlAssembler` is a valid object to pass
to `url.format()` or any function accepting this kind of object as
parameter.


API Reference
-------------

###### `new UrlAssembler([baseUrl])`
- `baseUrl`: will be used for protocol, hostname, port and other base url kind of stuff.
- **returns** an instance of a URL assembler.

###### `.template(template)`
- `template` a *string* with dynamic part noted as `:myparam` . For example `'/hello/:param/world'`
- **returns** a new instance of `UrlAssembler` with this template configured

###### `.param(key, value[, strict])`
- `key`: a *string* of the dynamic part to replace
- `value`: a *string* to replace the dynamic part with
- **returns** a new instance of `UrlAssembler` with the parameter `key` replaced with `value`. If strict is falsy, the key will be added as query parameter.

###### `.param(params[, strict])`
- `params`: a *hash* of key/value to give to the method above
- `strict` a flag passed to the method above
- **returns** a new instance of `UrlAssembler` with all the parameters replaced

###### `.query(key, value)`
- `key`: the name of the parameter to configure
- `value`: the value of the parameter to configure
- **returns** a new instance of `UrlAssembler` with the key=value pair added as query parameter with the `qs` module.

###### `.query(params)`
shortcut for the previous method with a hash of key/value.


Test
----

Tests are written with [mocha][mocha-url] and covered with [istanbul][istanbul-url]
You can run the tests with `npm test`.

Contributing
------------

Anyone is welcome to submit issues and pull requests


License
-------

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Florent Jaby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[travis-image]: http://img.shields.io/travis/Floby/node-url-assembler/master.svg?style=flat
[travis-url]: https://travis-ci.org/Floby/node-url-assembler
[coveralls-image]: http://img.shields.io/coveralls/Floby/node-url-assembler/master.svg?style=flat
[coveralls-url]: https://coveralls.io/r/Floby/node-url-assembler
[mocha-url]: https://github.com/visionmedia/mocha
[istanbul-url]: https://github.com/gotwarlost/istanbul
