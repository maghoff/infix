function BinaryOperation(lhs, op, rhs) {
	this.lhs = lhs;
	this.op = op;
	this.rhs = rhs;
}

BinaryOperation.prototype.visit = function (parseHandler) {
	return parseHandler.binaryOperation(
		this.lhs.visit(parseHandler),
		this.op,
		this.rhs.visit(parseHandler)
	);
};

function IntegerLiteral(literal) {
	this.literal = literal;
}

IntegerLiteral.prototype.visit = function (parseHandler) {
	return parseHandler.integerLiteral(this.literal);
};

function DecimalLiteral(literal, wholePart, decimalPart) {
	this.literal = literal;
	this.wholePart = wholePart;
	this.decimalPart = decimalPart;
}

DecimalLiteral.prototype.visit = function (parseHandler) {
	return parseHandler.decimalLiteral(this.literal, this.wholePart, this.decimalPart);
};

function Reference(name) {
	this.name = name;
}

Reference.prototype.visit = function (parseHandler) {
	return parseHandler.reference(this.name);
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
