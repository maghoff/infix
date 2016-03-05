#!/usr/bin/env node

var infix = require('..');

function explicitlyCompile() {
	var f = infix.compile("100 - $0", infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < 100000; i++) {
		x += f(i);
	}
	return x;
}

function memoizing() {
	var evaluate = infix.memoizing.evaluatorFor(infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < 100000; i++) {
		x += evaluate("100 - $0", i);
	}
	return x;
}

function nonMemoizing() {
	var evaluate = infix.evaluatorFor(infix.nativeNumberProvider);

	var x = 0;
	for (var i = 0; i < 100000; i++) {
		x += evaluate("100 - $0", i);
	}
	return x;
}

function time(inner) {
	var start = Date.now();
	inner();
	return Date.now() - start;
}

function trial(inner) {
	console.log("Measuring " + inner.name);
	for (var i = 0; i < 10; ++i) {
		console.log(time(inner));
	}
}

trial(explicitlyCompile);
trial(memoizing);
trial(nonMemoizing);
