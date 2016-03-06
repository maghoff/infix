var ast = require('./ast');
var codegen = require('./codegen');
var parse = require('./parse');

function compile(source, numberProvider) {
	return eval(codegen(source))(numberProvider);
}

function compilerFor(numberProvider) {
	return function (source) {
		return compile(source, numberProvider);
	};
}

exports.compile = compile;
exports.compilerFor = compilerFor;
