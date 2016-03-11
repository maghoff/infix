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
	// Copy arguments this silly way to substantially help optimizer:
	var args = new Array(arguments.length - 2);
	for (var i = 0; i < args.length; ++i) args[i] = arguments[i + 2];

	var parseHandler = parseHandlerFactory.call(this, numberProvider, args);

	return parse(source, parseHandler);
}

function evaluatorFor(numberProvider) {
	return function (source) {
		// Copy arguments this silly way to substantially help optimizer:
		var args = new Array(arguments.length - 1);
		for (var i = 0; i < args.length; ++i) args[i] = arguments[i + 1];

		var parseHandler = parseHandlerFactory.call(this, numberProvider, args);

		return parse(source, parseHandler);
	};
}

exports.evaluate = evaluate;
exports.evaluatorFor = evaluatorFor;
exports.parseHandlerFactory = parseHandlerFactory;
