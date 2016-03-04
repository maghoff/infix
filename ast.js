var precedence = {
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2,
};

function BinaryOperation(lhs, op, rhs) {
	this.lhs = lhs;
	this.op = op;
	this.rhs = rhs;
}

BinaryOperation.prototype.asJS = function (constName, paramName) {
	return "np['" + this.op + "']" +
		"(" + this.lhs.asJS(constName, paramName) + ", " + this.rhs.asJS(constName, paramName) + ")";
};

BinaryOperation.prototype.asExpression = function (parentPrecedence) {
	var parenthesis = precedence[this.op] < parentPrecedence;
	var core = this.lhs.asExpression(precedence[this.op]) + this.op + this.rhs.asExpression(precedence[this.op] + 1);
	return parenthesis ? "(" + core + ")" : core;
};

function IntegerLiteral(literal) {
	this.literal = literal;
}

IntegerLiteral.prototype.asJS = function (constName) {
	return constName(this.literal, "np.parseInt('" + this.literal + "')");
};

IntegerLiteral.prototype.asExpression = function () {
	return this.literal;
};

function DecimalLiteral(literal, wholePart, decimalPart) {
	this.literal = literal;
	this.wholePart = wholePart;
	this.decimalPart = decimalPart;
}

DecimalLiteral.prototype.asJS = function (constName) {
	return constName(this.literal, "np.parseDecimal('" + this.wholePart + "', '" + this.decimalPart + "')");
};

DecimalLiteral.prototype.asExpression = function () {
	return this.literal;
};

function Reference(name) {
	this.name = name;
}

Reference.prototype.asJS = function (constName, paramName) {
	return paramName(this.name);
};

Reference.prototype.asExpression = function () {
	return "$" + this.name;
};

var parseHandler = {
	integerLiteral: function (x) { return new IntegerLiteral(x); },
	decimalLiteral: function (x, y, z) { return new DecimalLiteral(x, y, z); },
	binaryOperation: function (x, y, z) { return new BinaryOperation(x, y, z); },
	reference: function (x) { return new Reference(x); },
};

exports.BinaryOperation = BinaryOperation;
exports.IntegerLiteral = IntegerLiteral;
exports.DecimalLiteral = DecimalLiteral;
exports.Reference = Reference;
exports.parseHandler = parseHandler;
