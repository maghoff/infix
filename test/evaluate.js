'use strict';

var assert = require('assert');
var infix = require('..');

describe('evaluatorFor nativeNumberProvider', function () {
	var evaluate = infix.evaluatorFor(infix.nativeNumberProvider);

	it('should evaluate a constant', function () {
		assert.equal(3.14, evaluate("3.14"));
	});

	it('should evaluate a constant expression', function () {
		assert.equal(8, evaluate("2*(2+8/4)"));
	});

	it('should substitute an argument', function () {
		assert.equal(8, evaluate("2*(2+$0/4)", 8));
	});

	it('should handle mixed parameter ordering', function () {
		assert.equal(8, evaluate("$3*($2+$0/$1)", 8, 4, 2, 2));
	});

	it('should handle parameter gaps', function () {
		assert.equal(4, evaluate("$3", 1, 2, 3, 4, 5, 6));
	});

	it('should evaluate a mixed number', function () {
		assert.equal(3.5, evaluate("1 + 1 1/2 + 1"));
	});
});
