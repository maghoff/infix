var assert = require('assert');
var ast = require('../ast');
var evaluate = require('../evaluate');
var infix = require('..');

describe('generate_expression', function() {
	it('should generate an expression', function () {
		var ast = infix.parse("10/(2+3)*$0");
		assert.equal("10/(2+3)*$0", infix.generateExpression(ast));
	});

	function generateTree(depth) {
		if (depth === 1) {
			return new ast.IntegerLiteral((Math.random()*100).toFixed(0).toString());
		} else return new ast.BinaryOperation(
			generateTree(depth-1),
			"+-*/".substr(Math.floor(Math.random() * 4), 1),
			generateTree(depth-1)
		);
	}

	it('should not change meaning of expression', function () {
		for (var i = 0; i < 100; ++i) {
			var ast = generateTree(5);
			assert.equal(
				ast.visit(evaluate.parseHandlerFactory(infix.nativeNumberProvider)),
				infix.evaluate(infix.generateExpression(ast), infix.nativeNumberProvider)
			);
		}
	});
});
