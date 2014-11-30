# co-simplify
![Build Status](https://img.shields.io/travis/bornkiller/co-simplify/master.svg?style=flat)
![Coverage Report](http://img.shields.io/coveralls/bornkiller/co-simplify.svg?style=flat)
![Package Dependency](https://david-dm.org/bornkiller/co-simplify.svg?style=flat)
![Package DevDependency](https://david-dm.org/bornkiller/co-simplify/dev-status.svg?style=flat)

Generator based control flow goodness for nodejs and the browser. only support yield
`Promise`, `Promise Array`.

## Attention
Only for study, not for production.
You can see [tj/co](https://github.com/tj/co for production)

## Platform Compatibility

`co-simplify` requires a `Promise` implementation.
For versions of node `< 0.11` and for many older browsers,
you should/must include your own `Promise` polyfill.

When using node 0.11.x or greater, you must use the `--harmony-generators`
flag or just `--harmony` to get access to generators.

When using node 0.10.x and lower or browsers without generator support,
you must use [gnode](https://github.com/TooTallNate/gnode) and/or [regenerator](http://facebook.github.io/regenerator/).

## Examples

```js
var co = require('co-simplify');

co(function* () {
  var result = yield Promise.resolve(true);
  return result;
}).then(function (value) {
  console.log(value);
}, function (err) {
  console.error(err);
});

co(function *(){
  // yield promise
  var result = yield Promise.resolve(true);
}).catch(onerror);

co(function *(){
  // yield promise arrays
  var a = Promise.resolve(1);
  var b = Promise.resolve(2);
  var c = Promise.resolve(3);
  var res = yield [a, b, c];
  console.log(res);
  // => [1, 2, 3]
}).catch(onerror);

```

### Promises

[Read more on promises!](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## License

  MIT
