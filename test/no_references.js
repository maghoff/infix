var assert = require('assert');
var infix = require('..');

describe('noReferences.evaluatorFor nativeNumberProvider', function () {
	var evaluate = infix.noReferences.evaluatorFor(infix.nativeNumberProvider);

	it('should evaluate a constant', function () {
		assert.equal(3.14, evaluate("3.14"));
	});

	it('should evaluate a constant expression', function () {
		assert.equal(8, evaluate("2*(2+8/4)"));
	});

	it('should not accept a reference', function () {
		assert.throws(evaluate.bind(null, "2*(2+$0/4)", 8));
	});
});

describe('noReferences.evaluate', function () {
	var evaluate = infix.noReferences.evaluate;

	it('should evaluate a constant', function () {
		assert.equal(3.14, evaluate("3.14", infix.nativeNumberProvider));
	});

	it('should evaluate a constant expression', function () {
		assert.equal(8, evaluate("2*(2+8/4)", infix.nativeNumberProvider));
	});

	it('should not accept a reference', function () {
		assert.throws(evaluate.bind(null, "2*(2+$0/4)", infix.nativeNumberProvider, 8));
	});
});
