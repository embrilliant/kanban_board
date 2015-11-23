
//var citiesList = require("CitiesList");
//var city = require("City.js");

//var assert = require('assert');
/*describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});*/

/*describe('test', function() {
    describe('test of test', function () {
        it('this should pass', function () {
            var bla = city;
            assert.equal(5, city.getWhatEverData());
            //assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});*/

//var City = require('../../../lib/emily/weatherAPI/City').City;
var assert = require('assert');

//test if sinon works

var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

console.log(sinon);

function hello(name, cb) {
    cb("hello " + name);
}

describe("hellooooooooooooooooooooo", function () {
    it("should call callback with correct greeting", function () {
        var cb = sinon.spy();

        hello("foo", cb);

        expect(cb).to.have.been.calledWith("hello foo");
    });
});

describe("Test if things workkkkkkkkkkkkkkkk", function() {
    it("should passssssssss", function() {
        assert.equal("Berlin", "Berlin");
    });
});

describe("3rddddddddddddddddd", function() {
    it("calls the original function", function () {
        var callback = sinon.spy();
        //var proxy = once(callback);
        var proxy = callback;

        proxy();

        assert(callback.called);
    });
});

function once(fn) {
    var returnValue;
    var called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}

describe("sinon stubbbbbbbbbbbbbbbbbbbbbb", function() {
    it("does something", function() {
        var callback = sinon.stub().returns(42);
        //var proxy = once(callback);
        var proxy = callback;

        assert.equal(proxy(), 42);
    });
});

/*var func = sinon.spy();
func(1, 'foo');
expect(func.called).to.be.true;
// The following two assertions are identical
expect(func.calledOnce).to.be.true;
expect(func.callCount).to.equal(1);
// The following two assertions are identical
expect(func.firstCall.calledWith(sinon.match.number, sinon.match.string)).to.be.true;
expect(func.getCall(0).calledWith(sinon.match.number, sinon.match.string)).to.be.true;
// You can even verify that a function was called with specific arguments (not just types)
expect(func.firstCall.calledWith(1, 'foo')).to.be.true;*/

//var server = sinon.fakeServer.create();
//var jQuery = require("../../../lib/jquery/dist/jquery.js"); //doesn't work.
//console.log(server);

// Function under test
describe("Spies", function() {
    it("calls the original function", function () {
        var spy = sinon.spy();
        //var proxy = once(spy);
        var proxy = spy;

        proxy();

        assert(spy.called);
    });
});

describe("Stubs", function() {
    it("returns the return value from the original function", function () {
        var stub = sinon.stub().returns(42);
        //var proxy = once(stub);
        var proxy = stub;

        assert.equal(proxy(), 42);
    });
});

describe("Mocks", function() {
    it("returns the return value from the original function", function () {
        var myAPI = {
                method: function () {
            }
        };
        var mock = sinon.mock(myAPI);
        mock.expects("method").once().returns(2);

        var proxy = once(myAPI.method);

        assert.equal(proxy(), 2);
        //mock.verify();
    });
});

describe("Mocks", function() {
    it("returns the return value from the original function", function () {
        var func = sinon.spy();
        func(1, 'foo');
        expect(func.called).to.be.true;
    });
});


// The following two assertions are identical
expect(func.firstCall.calledWith(sinon.match.number, sinon.match.string)).to.be.true;
expect(func.getCall(0).calledWith(sinon.match.number, sinon.match.string)).to.be.true;
// You can even verify that a function was called with specific arguments (not just types)
expect(func.firstCall.calledWith(1, 'foo')).to.be.true;