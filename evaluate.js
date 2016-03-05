var parse = require('./parse');

function parseHandlerFactory(numberProvider, args) {
	return {
		integerLiteral: numberProvider.parseInt,
		decimalLiteral: function (literal, before, after) { return numberProvider.parseDecimal(before, after); },
		binaryOperation: function (x, op, z) { return numberProvider[op](x, z); },
		reference: function (x) { return args[parseInt(x, 10)]; },
	};
};

function evaluate(source, numberProvider) {
	var args = Array.prototype.slice.call(arguments, 2);
	var parseHandler = parseHandlerFactory.call(this, numberProvider, args);

	return parse(source, parseHandler);
}

function evaluatorFor(numberProvider) {
	return function (source) {
		var args = Array.prototype.slice.call(arguments, 1);
		var parseHandler = parseHandlerFactory.call(this, numberProvider, args);

		return parse(source, parseHandler);
	};
}

exports.evaluate = evaluate;
exports.evaluatorFor = evaluatorFor;
exports.parseHandlerFactory = parseHandlerFactory;
