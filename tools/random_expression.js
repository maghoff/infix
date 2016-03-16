var ast = require('../ast');

module.exports = function generateTree(depth, args) {
	if (depth === 1) {
		if (args && (Math.random() < 0.2)) {
			return new ast.Reference(Math.floor(Math.random()*args).toFixed(0).toString());
		} else {
			return new ast.IntegerLiteral((Math.random()*100).toFixed(0).toString());
		}
	} else return new ast.BinaryOperation(
		generateTree(depth-1, args),
		"+-*/".substr(Math.floor(Math.random() * 4), 1),
		generateTree(depth-1, args)
	);
};
