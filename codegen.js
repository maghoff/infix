module.exports = function (ast) {
	var constDecls = {}, constRefs = {}, constIndex = 0;
	var maxParam = -1;

	function constName(literal, decl) {
		if (!constDecls.hasOwnProperty(literal)) {
			constDecls[literal] = decl;
			constRefs[literal] = "c" + (constIndex++);
		}
		return constRefs[literal];
	}

	function paramName(id) {
		maxParam = Math.max(maxParam, parseInt(id, 10));
		return "$" + id;
	}

	var expr = ast.asJS(constName, paramName);
	var params = [];

	for (var i = 0; i <= maxParam; ++i) {
		params.push('$' + i);
	}

	return [
		"(function (np) {",
			"var parseInt = np.parseInt;",
			"var parseDecimal = np.parseDecimal;",
			"var op = { '+': np['+'], '-': np['-'], '*': np['*'], '/': np['/'] };",
		].concat(
			Object.keys(constDecls).map(function (literal) {
				return "var " + constRefs[literal] + " = " + constDecls[literal] + ";";
			})
		).concat([
			"return function (" + params.join(', ') + ") {",
				"return " + expr + ";",
			"};",
		"})",
	]).join(' ');
}
