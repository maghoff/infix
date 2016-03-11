var compile = require('./compile');

function evaluatorFor(numberProvider) {
	var cache = {};

	return function (source) {
		// Copy arguments this silly way to substantially help optimizer:
		var args = new Array(arguments.length - 1);
		for (var i = 0; i < args.length; ++i) args[i] = arguments[i + 1];

		if (!cache.hasOwnProperty(source)) {
			cache[source] = compile.compile(source, numberProvider);
		}
		return cache[source].apply(this, args);
	};
}

exports.evaluatorFor = evaluatorFor;
