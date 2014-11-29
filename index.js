module.exports = co;

function co(generator) {
  var ctx = this;
  var gen = generator.apply(this);
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
      if (!Array.isArray(ret.value)) return ret.value.then(resolvedPromise, rejectedPromise);
      if (Array.isArray(ret.value)) return arrayToPromise(ret.value).then(resolvedPromise, rejectedPromise);
    }
  }

  function arrayToPromise(array) {
    return Promise.all(array);
  }
}



