var compile = require('./compile');

function evaluatorFor(numberProvider) {
	var cache = {};

	return function (source) {
		if (!cache.hasOwnProperty(source)) {
			cache[source] = compile.compile(source, numberProvider);
		}
		return cache[source].apply(this, Array.prototype.slice.call(arguments, 1));
	};
}

exports.evaluatorFor = evaluatorFor;
