#!/usr/bin/env node

'use strict';

var infix = require('..');

function explicitlyCompile(iterations) {
	var f = infix.compile("100 - $0", infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < iterations; i++) {
		x += f(i);
	}
	return x;
}

function memoizing(iterations) {
	var evaluate = infix.memoizing.evaluatorFor(infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < iterations; i++) {
		x += evaluate("100 - $0", i);
	}
	return x;
}

function nonMemoizing(iterations) {
	var evaluate = infix.evaluatorFor(infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < iterations; i++) {
		x += evaluate("100 - $0", i);
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

var a = trial(explicitlyCompile, 10000000);
var b = trial(memoizing, 1000000);
var c = trial(nonMemoizing, 100000);

console.log(`explicitlyCompile is ${(b/a).toFixed(2)} times as fast as memoizing`);
console.log(`memoizing is ${(c/b).toFixed(2)} times as fast as nonMemoizing`);
