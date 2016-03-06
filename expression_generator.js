var precedence = {
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2,
};

var parseHandler = {
	integerLiteral: function (literal) { return [literal, 3]; },
	decimalLiteral: function (literal, before, after) { return [literal, 3]; },
	binaryOperation: function (lhs, op, rhs) {
		var p = precedence[op];
		var lhsp = lhs[1] < p ? '(' + lhs[0] + ')' : lhs[0];
		var rhsp = rhs[1] <= p ? '(' + rhs[0] + ')' : rhs[0];
		return [lhsp + op + rhsp, p];
	},
	reference: function (id) { return ["$" + id, 3]; },
};

function generate(ast) {
	return ast.visit(parseHandler)[0];
}

exports.parseHandler = parseHandler;
exports.generate = generate;
