var co = require('../index.js');
var should = require('should');

describe('co-simplify', function () {
    it('should be a function', function () {
        co.should.be.a.Function;
    });

    it('should yield promise and return value', function (done) {
        co(function *() {
            var shuffle = yield Promise.resolve('A');
            var sample = yield Promise.reject('B');
            shuffle.should.equal('A');
            sample.should.equal('B');
            done();
        })
    });

    it('should yield promise arrays', function (done) {
        co(function *() {
            var shuffle = yield [Promise.resolve('A'), Promise.resolve('B')];
            shuffle.should.eql(['A', 'B']);
            done();
        })
    });

    it('should yield generator function', function (done) {
        var love = function *() {
            var first = yield Promise.resolve('A');
            var second = yield Promise.resolve('B');
            return first + second;
        };

        co(function *() {
            var result;
            result = yield love;
            return result;
        }).then(function(value) {
            value.should.equal('AB');
            done();
        })
    });

    it('should yield generator', function (done) {
        var story = function *() {
            var first = yield Promise.resolve('A');
            var second = yield Promise.resolve('B');
            return first + second;
        };
        var love =story();

        co(function *() {
            var result;
            result = yield love;
            return result;
        }).then(function(value) {
            value.should.equal('AB');
            done();
        })
    });


    it('should resolve returned value for final promise', function (done) {
        co(function *() {
            var shuffle = yield Promise.resolve('A');
            var sample = yield Promise.resolve('B');
            return shuffle + sample;
        }).then(function(value) {
            value.should.equal('AB');
            done();
        })
    });
});

describe('co-simplify error resolve', function () {
    it('should taken error as rejected promise when come after resolved promise', function (done) {
        co(function *() {
            yield Promise.resolve('A');
            throw new Error('something wrong');
            yield Promise.reject('B');
        }).catch(function(err) {
            err.should.be.a.error;
            err.message.should.equal('something wrong');
            done();
        })
    });


    it('should taken error as rejected promise when come after rejected promise', function (done) {
        co(function *() {
            yield Promise.resolve('A');
            yield Promise.reject('B');
            throw new Error('something wrong');
        }).catch(function(err) {
            err.should.be.a.error;
            err.message.should.equal('something wrong');
            done();
        })
    });

    it('should taken illegal yield object as error', function (done) {
        co(function *() {
            yield 'A';
        }).catch(function(err) {
            err.should.be.a.error;
            err.message.should.match(/^only promise, promise array support yield, while you pass/);
            done();
        })
    });


    it('should taken illegal yield array as error', function (done) {
        co(function *() {
            yield [Promise.resolve('A'), 'B'];
        }).catch(function(err) {
            err.should.be.a.error;
            err.message.should.match(/^only promise, promise array support yield, while you pass/);
            done();
        })
    });
});
