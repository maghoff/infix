#!/usr/bin/env node

var fs = require('fs');
var infix = require('../');

var benchData = fs.readFileSync('bench.txt', 'utf8').trim().split('\n').slice(0, 10);

var evaluate = infix.evaluatorFor(infix.nativeNumberProvider);
console.log(benchData.map(function (x) {
	var f = infix.compile(x, infix.nativeNumberProvider);
	for (var i=0; i<1000; ++i) {
		f();
// 		console.log(eval(x));
// 		evaluate(x);
	}
}).length);

// var args=[Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
// var args=[10,23,132,43,5,2];
//
// var evaluate = infix.evaluatorFor(infix.nativeNumberProvider);
// console.log(benchData.map(function (x) { return evaluate.apply(this, [x].concat(args)); }).length);
