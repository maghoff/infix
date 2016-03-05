var parse = require('./parse');

function parseHandlerFactory(numberProvider) {
	return {
		integerLiteral: numberProvider.parseInt,
		decimalLiteral: function (literal, before, after) { return numberProvider.parseDecimal(before, after); },
		binaryOperation: function (x, op, z) { return numberProvider[op](x, z); },
		reference: function (x) { throw new Error("References are not accepted in input"); },
	};
};

function evaluate(source, numberProvider) {
	var parseHandler = parseHandlerFactory(numberProvider);
	return parse(source, parseHandler);
}

function evaluatorFor(numberProvider) {
	var parseHandler = parseHandlerFactory(numberProvider);
	return function (source) {
		return parse(source, parseHandler);
	};
}

exports.evaluate = evaluate;
exports.evaluatorFor = evaluatorFor;
exports.parseHandlerFactory = parseHandlerFactory;
