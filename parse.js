'use strict';

function parse_factor(input, handler) {
	var pattern = /^\s*(((\d+) (\d+)\/(\d+))|(([-+])?(\d+)(\.(\d+))?)|(\$(\d+))|(\())/;
	var match = input.match(pattern);
	if (!match) throw new Error("Expected number, found " + JSON.stringify(input.substr(0, 6)) + "...");
	var rest = input.substr(match[0].length);

	var FRAC = 2, NUM = FRAC+4, REF = NUM+5, PAR = REF+2;

	if (match[NUM]) {
		var sign = match[NUM+1] || "";
		var before = match[NUM+2];
		var after = match[NUM+4] || "";
		if (!after) {
			return [
				handler.integerLiteral(match[1]),
				rest
			];
		} else {
			return [
				handler.decimalLiteral(match[1], sign + before, after),
				rest
			];
		}
	} else if (match[PAR]) {
		var nested = parse_expression(rest, handler);
		var closing_pattern = /^\s*\)/;
		if (!(match = nested[1].match(closing_pattern))) throw new Error("Expected ')', found " + JSON.stringify(nested[1].substr(0, 6)) + "...");
		return [
			nested[0],
			nested[1].substr(match[0].length)
		];
	} else if (match[FRAC]) {
		return [
			handler.binaryOperation(
				handler.integerLiteral(match[FRAC+1]),
				'+',
				handler.binaryOperation(
					handler.integerLiteral(match[FRAC+2]),
					'/',
					handler.integerLiteral(match[FRAC+3])
				)
			),
			rest
		];
	} else if (match[REF]) {
		return [
			handler.reference(match[REF+1]),
			rest
		];
	} else {
		throw new Error("Logic error");
	}
}

function parse_term(input, handler) {
	var lhs_result = parse_factor(input, handler);
	var lhs = lhs_result[0], rest = lhs_result[1];

	var pattern = /^\s*([*\/])/;
	var match;
	while (match = rest.match(pattern)) {
		rest = rest.substr(match[0].length);
		var rhs_result = parse_factor(rest, handler);
		var rhs = rhs_result[0];
		rest = rhs_result[1];

		lhs = handler.binaryOperation(lhs, match[1], rhs);
	}

	return [ lhs, rest ];
}

function parse_expression(input, handler) {
	var lhs_result = parse_term(input, handler);
	var lhs = lhs_result[0], rest = lhs_result[1];

	var pattern = /^\s*([+-])/;
	var match;
	while (match = rest.match(pattern)) {
		rest = rest.substr(match[0].length);
		var rhs_result = parse_term(rest, handler);
		var rhs = rhs_result[0];
		rest = rhs_result[1];

		lhs = handler.binaryOperation(lhs, match[1], rhs);
	}

	return [ lhs, rest ];
}

function parse(input, handler) {
	var result = parse_expression(input, handler);
	if (!result[1].match(/^\s*$/)) throw new Error("Unexpected: " + JSON.stringify(result[1].substr(0, 6)) + "...");
	return result[0];
}


module.exports = parse;
