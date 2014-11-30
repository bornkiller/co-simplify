module.exports = co;

function co(generator) {
  var ctx = this;
  var gen = isGeneratorFunction(generator) ? generator.call(this) : generator;
  return resolvedPromise();
  function resolvedPromise(value) {
    var ret;
    try {
      ret = gen.next(value);
    } catch (err) {
      return Promise.reject(err);
    }
    return mirrorNext(ret);
  }

  function rejectedPromise(err) {
    var ret;
    try {
      ret = gen.next(err);
    } catch (err) {
      return Promise.reject(err);
    }

    return mirrorNext(ret);
  }

  function mirrorNext(ret) {
    if (ret.done) {
      return Promise.resolve(ret.value);
    } else {
      if (isPromise(ret.value)) return ret.value.then(resolvedPromise, rejectedPromise);
      if (isPromiseArray(ret.value)) return arrayToPromise(ret.value).then(resolvedPromise, rejectedPromise);
      if (isGeneratorFunction(ret.value) || isGenerator(ret.value)) return co(ret.value);
      if ('function' == typeof ret.value) return thunkToPromise(ret.value).then(resolvedPromise, rejectedPromise);
      return Promise.reject(new Error('only promise, promise array support yield, while you pass ' + String(ret.value)))
    }
  }

  function arrayToPromise(array) {
    return Promise.all(array);
  }

  function thunkToPromise(thunk) {
    return new Promise(function(resolve, reject) {
      thunk(function(err, value) {
        if (err) return reject(err);
        return resolve(value);
      })
    })
  }

  function isPromise(obj) {
    return 'function' == typeof obj.then;
  }

  function isPromiseArray(obj) {
    return Array.isArray(obj) && obj.every(isPromise);
  }


  function isGenerator(obj) {
    return 'function' == typeof obj.next && 'function' == typeof obj.throw;
  }

  function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    return constructor && 'GeneratorFunction' == constructor.name;
  }

}



