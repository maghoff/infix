'use strict';

var parse = require('./parse');

function CodeGenerator() {
	if (!(this instanceof CodeGenerator)) return new CodeGenerator();

	this.constDecls = {};
	this.constRefs = {};
	this.constIndex = 0;
	this.maxParam = -1;
}

CodeGenerator.prototype.constName = function (literal, decl) {
	if (!this.constDecls.hasOwnProperty(literal)) {
		this.constDecls[literal] = decl;
		this.constRefs[literal] = "c" + (this.constIndex++);
	}
	return this.constRefs[literal];
};

CodeGenerator.prototype.paramName = function (id) {
	this.maxParam = Math.max(this.maxParam, parseInt(id, 10));
	return "$" + id;
};

CodeGenerator.prototype.integerLiteral = function (literal) {
	return this.constName(literal, "np.parseInt('" + literal + "')");
};

CodeGenerator.prototype.decimalLiteral = function (literal, wholePart, decimalPart) {
	return this.constName(literal, "np.parseDecimal('" + wholePart + "', '" + decimalPart + "')");
};

CodeGenerator.prototype.binaryOperation = function (lhs, op, rhs) {
	return "np['" + op + "']" + "(" + lhs + ", " + rhs + ")";
};

CodeGenerator.prototype.reference = function (id) {
	return this.paramName(id);
};

function parseOrVisit(sourceOrAst, parseHandler) {
	if (typeof sourceOrAst === "string") return parse(sourceOrAst, parseHandler);
	else return sourceOrAst.visit(parseHandler);
}

CodeGenerator.prototype.generateCode = function (source) {
	var expr = parseOrVisit(source, this);

	var params = [];

	for (var i = 0; i <= this.maxParam; ++i) {
		params.push('$' + i);
	}

	return [
		"(function (np) {",
		].concat(
			Object.keys(this.constDecls).map(function (literal) {
				return "var " + this.constRefs[literal] + " = " + this.constDecls[literal] + ";";
			}.bind(this))
		).concat([
			"return function (" + params.join(', ') + ") {",
				"return " + expr + ";",
			"};",
		"})",
	]).join(' ');
};


module.exports = function (source) {
	var codeGenerator = new CodeGenerator();
	return codeGenerator.generateCode(source);
}
