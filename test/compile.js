'use strict';

var assert = require('assert');
var infix = require('..');

describe('compile', function() {
	it('should return a function', function () {
		assert.equal('function', typeof infix.compile("1", infix.nativeNumberProvider));
	});

	describe('compilerFor nativeNumberProvider', function () {
		var compile = infix.compilerFor(infix.nativeNumberProvider);

		it('should return a function', function () {
			assert.equal('function', typeof compile("1"));
		});

		it('should evaluate a constant', function () {
			assert.equal(1, compile("1")());
		});

		it('should evaluate a decimal number constant', function () {
			assert.equal(1.05, compile("1.05")());
		});

		it('should evaluate a constant expression', function () {
			assert.equal(8, compile("2*(2+8/4)")());
		});

		it('should substitute an argument', function () {
			assert.equal(8, compile("2*(2+$0/4)")(8));
		});

		it('should evaluate multiple times', function () {
			var f = compile("2*(2+$0/$1)");
			assert.equal(8, f(8, 4));
			assert.equal(-2, f(-12, 4));
		});

		it('should handle mixed parameter ordering', function () {
			var f = compile("$3*($2+$0/$1)");
			assert.equal(8, f(8, 4, 2, 2));
			assert.equal(1, f(-12, 4, 4, 1));
		});

		it('should handle parameter gaps', function () {
			var f = compile("$3");
			assert.equal(4, f(1, 2, 3, 4, 5, 6));
		});

		it('should evaluate a mixed number', function () {
			assert.equal(3.5, compile("1 + 1 1/2 + 1")());
		});
	});
});
