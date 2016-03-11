'use strict';

var assert = require('assert');
var infix = require('..');

describe('memoizing.evaluatorFor', function() {
	var evaluate = infix.memoizing.evaluatorFor(infix.nativeNumberProvider);

	it('should evaluate a constant', function () {
		assert.equal(3.14, evaluate("3.14"));
	});

	it('should evaluate a constant expression', function () {
		assert.equal(8, evaluate("2*(2+8/4)"));
	});

	it('should substitute an argument', function () {
		assert.equal(8, evaluate("2*(2+$0/4)", 8));
	});

	it('should work multiple times for the same expression', function () {
		assert.equal(6, evaluate("2*(2+$0/4)", 4));
		assert.equal(8, evaluate("2*(2+$0/4)", 8));
		assert.equal(10, evaluate("2*(2+$0/4)", 12));
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
