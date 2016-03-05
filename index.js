var ast = require('./ast');
var compile = require('./compile');
var evaluate = require('./evaluate');
var parse = require('./parse');

exports.codegen = require('./codegen');
exports.compile = compile.compile;
exports.compilerFor = compile.compilerFor;
exports.evaluate = evaluate.evaluate;
exports.evaluatorFor = evaluate.evaluatorFor;
exports.memoizing = require('./memoizing');
exports.nativeNumberProvider = require('./native_number_provider');
exports.noReferences = require('./no_references');
exports.parse = function (source, parseHandler) { return parse(source, parseHandler || ast.parseHandler); };
