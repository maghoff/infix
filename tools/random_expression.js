#!/usr/bin/env node

var ast = require('./ast');

function generateTree(depth) {
	if (depth === 1) {
		if (Math.random() < 0.8) {
			return new ast.IntegerLiteral((Math.random()*100).toFixed(0).toString());
		} else {
			return new ast.Reference((Math.random()*5).toFixed(0).toString());
		}
	} else return new ast.BinaryOperation(
		generateTree(depth-1),
		"+-*/".substr(Math.floor(Math.random() * 4), 1),
		generateTree(depth-1)
	);
}

for (var i=0; i<10000; ++i) {
	console.log(generateTree(5).asExpression());
}
