function BinaryOperation(lhs, op, rhs) {
	this.lhs = lhs;
	this.op = op;
	this.rhs = rhs;
}

BinaryOperation.prototype.asJS = function (constName, paramName) {
	return "np['" + this.op + "']" +
		"(" + this.lhs.asJS(constName, paramName) + ", " + this.rhs.asJS(constName, paramName) + ")";
};

function IntegerLiteral(literal) {
	this.literal = literal;
}

IntegerLiteral.prototype.asJS = function (constName) {
	return constName(this.literal, "np.parseInt('" + this.literal + "')");
};

function DecimalLiteral(literal, wholePart, decimalPart) {
	this.literal = literal;
	this.wholePart = wholePart;
	this.decimalPart = decimalPart;
}

DecimalLiteral.prototype.asJS = function (constName) {
	return constName(this.literal, "np.parseDecimal('" + this.wholePart + "', '" + this.decimalPart + "')");
};

function Reference(name) {
	this.name = name;
}

Reference.prototype.asJS = function (constName, paramName) {
	return paramName(this.name);
};


exports.BinaryOperation = BinaryOperation;
exports.IntegerLiteral = IntegerLiteral;
exports.DecimalLiteral = DecimalLiteral;
exports.Reference = Reference;
