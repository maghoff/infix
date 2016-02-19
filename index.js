var parse = require('./parse');
var codegen = require('./codegen');

function compile(source, numberProvider) {
	return eval(codegen(parse(source)))(numberProvider);
}

function compilerFor(numberProvider) {
	return function (source) {
		return compile(source, numberProvider);
	};
}

function evaluate(source, numberProvider) {
	return compile(source, numberProvider)
		.apply(this, Array.prototype.slice.call(arguments, 2));
}

function evaluatorFor(numberProvider) {
	return function (source) {
		return evaluate.apply(
			this,
			[source, numberProvider]
				.concat(Array.prototype.slice.call(arguments, 1))
		);
	};
}

exports.nativeNumberProvider = require('./native_number_provider');
exports.parse = parse;
exports.codegen = codegen;
exports.compile = compile;
exports.compilerFor = compilerFor;
exports.evaluate = evaluate;
exports.evaluatorFor = evaluatorFor;
