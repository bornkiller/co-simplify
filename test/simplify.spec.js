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
