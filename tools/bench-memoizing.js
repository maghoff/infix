#!/usr/bin/env node

'use strict';

var infix = require('..');

var exp = infix.generateExpression(require('./random_expression')(10, 1));

function explicitlyCompile(iterations) {
	var f = infix.compile(exp, infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < iterations; i++) {
		x += f(i);
	}
	return x;
}

function memoizingCompiler(iterations) {
	var compile = infix.memoizing.compilerFor(infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < iterations; i++) {
		x += compile(exp)(i);
	}
	return x;
}

function memoizingEvaluator(iterations) {
	var evaluate = infix.memoizing.evaluatorFor(infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < iterations; i++) {
		x += evaluate(exp, i);
	}
	return x;
}

function nonMemoizing(iterations) {
	var evaluate = infix.evaluatorFor(infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < iterations; i++) {
		x += evaluate(exp, i);
	}
	return x;
}

function time(inner, iterations) {
	var start = Date.now();
	inner(iterations);
	return Date.now() - start;
}

function trial(inner, iterations) {
	process.stdout.write("Measuring " + inner.name);
	var times = [];
	for (var i = 0; i < 10; ++i) {
		times.push(time(inner, iterations));
	}
	times.sort();
	var avg = times.slice(2, -2).reduce(function (a, b) { return a+b; }) / 6 / iterations;
	console.log(" => " + (avg * 1000000).toFixed(2) + "ns per iteration");
	return avg;
}

var a = trial(explicitlyCompile, 10000);
var b = trial(memoizingCompiler, 2000);
var c = trial(memoizingEvaluator, 1000);
var d = trial(nonMemoizing, 100);

console.log(`explicitlyCompile is ${(b/a).toFixed(2)} times as fast as memoizingCompiler`);
console.log(`memoizingCompiler is ${(c/b).toFixed(2)} times as fast as memoizingEvaluator`);
console.log(`memoizingCompiler is ${(d/b).toFixed(2)} times as fast as nonMemoizing`);
