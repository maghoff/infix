'use strict';

var compile = require('./compile');

function compilerFor(numberProvider) {
	var cache = {};

	return function (source) {
		if (!cache.hasOwnProperty(source)) {
			return cache[source] = compile.compile(source, numberProvider);
		}
		return cache[source];
	};
}

function evaluatorFor(numberProvider) {
	// `evaluatorFor` is slower than `compilerFor` due to the handling of
	// `arguments`. For better speed with nearly the same syntax, please
	// always use `compilerFor`.
	var compile = compilerFor(numberProvider);

	return function (source) {
		// Copy arguments this silly way to substantially help optimizer:
		var args = new Array(arguments.length - 1);
		for (var i = 0; i < args.length; ++i) args[i] = arguments[i + 1];

		return compile(source).apply(this, args);
	};
}

exports.compilerFor = compilerFor;
exports.evaluatorFor = evaluatorFor;
