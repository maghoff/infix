'use strict';

module.exports = {
	parseInt: function (x) { return parseInt(x, 10); },
	parseDecimal: function (before, after) { return parseFloat(before + "." + after); },
	"+": function (lhs, rhs) { return lhs + rhs; },
	"-": function (lhs, rhs) { return lhs - rhs; },
	"*": function (lhs, rhs) { return lhs * rhs; },
	"/": function (lhs, rhs) { return lhs / rhs; },
};
