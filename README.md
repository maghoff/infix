Installation
============

    npm install infix

However, `infix` is not really useful on its own and should be coupled with a
number provider.

Motivation
==========
Since JavaScript offers no operator overloading support, it can be cumbersome to
work with number types other than the built-in `number`. Common custom number
types include bignums and rationals. This library attempts to make it more
convenient, and more uniform, to work with different number types.

Typically, custom number type usage can look like this:

    bignum.add(5, bignum.mul(bignum.div(10, 2), x))

Using `infix`, the above could end up looking like this:

    evaluate("5 + 10/2 * $0", x)

The `infix` version is more analogous to the way we normally work with
calculations.

Usage
=====
`infix` needs to work with a specific user defined number type. To help you get
up and running, the library includes a number provider backed by the native
`number` type: `nativeNumberProvider`. With this, we can evaluate some
expressions:

    var infix = require('infix');

    console.log(infix.evaluate("10/2", infix.nativeNumberProvider));
    // `5` is logged

If you want to evaluate multiple different things, it makes sense to specify the
number provider once:

    var evaluate = infix.evaluatorFor(infix.nativeNumberProvider);
    console.log(evaluate("10*2"), evaluate("10/2"));
    // `20 5` is logged

`infix` supports placeholders in the expression, which will be replaced by
arguments. Placeholders are composed of a `$`-symbol and an integer:

    console.log(evaluate("10*$0+$1", 1, 5));
    // `15` is logged

The placeholders can be in any order. Their corresponding argument will be
matched by the number, so `$0` will match the first number argument, `$1` the
next, and so on. It is permitted to skip indexes in the placeholders, using for
example only numbers `$3` and `$4`, which would mean arguments 0, 1 and 2 would
be ignored.

When evaluating the same expression multiple times, it can be a drag on
execution speed to parse the expression every time. `infix` offers support for
compiling a given expression to a function:

    var f = infix.compile("10*$0+$1", infix.nativeNumberProvider);
    console.log(f(2, -3), f(10, 2));
    // `17 102` is logged

Similarly to `evaluatorFor` above, `infix` also offers `compilerFor`:

    var compiler = infix.compilerFor(infix.nativeNumberProvider);
    var g = compiler("10*$0+$1");
    var h = compiler("$1/$0+$0");
    console.log(g(2, -3), h(2, 10));
    // `17 7` is logged

The compilation process will also give the chosen number provider a chance to
parse and cache all the constants needed in the expression up front.

For even more eager compilation, it is possible to generate the JavaScript
source code for the generated functions by using `infix.parse` and
`infix.codegen`:

    var ast = infix.parse("10*$0+$1");
    console.log(infix.codegen(ast));

The output from this is compact, but we can prettify it and add comments for
explanation:

    // `np` below is the number provider
    (function (np) {
        // The constants in the expression are parsed and the results cached:
        var c0 = np.parseInt('10');

        // Given this closure, the generated function will work as required:
        return function ($0, $1) {
            return np['+'](np['*'](c0, $0), $1);
        };
    })

The output from `codegen` can be used for compiling the expression ahead of
time, saving execution time in a deploy scenario.

Implementing a number provider
==============================
All of this is not very valuable until you supply another number provider.
Fortunately, the interface required for a number provider is fairly simple:

    {
        parseInt: function (literal) {
            // return an acceptable object corresponding to the value in the
            // string `literal`. `literal` matches /^-?[0-9]+$/

            // nativeNumberProvider implements this like so:
            return parseInt(x, 10);
        },
        parseDecimal: function (before, after) {
            // return an acceptable object corresponding to the decimal value
            // that has the string `before` before the decimal point and the
            // string `after` after the decimal point.

            // For example the input string `3.14` would generate a call to
            // parseDecimal with `before` as "3" and `after` as "14".

            // `before` matches /^-?[0-9]+$/
            // `after` matches /^[0-9]+$/

            // nativeNumberProvider implements this like so:
            return parseFloat(before + "." + after);
        },
        // Then follows four operators. They each take two arguments, the first
        // for the left hand side of the operator and the second for the right
        // hand side. The values passed in are either from one of the parse
        // functions above, a result of one of the operator functions below, or
        // an argument passed in for a placeholder in the compiled function.

        // nativeNumberProvider implements the operators like so:
        "+": function (lhs, rhs) { return lhs + rhs; },
        "-": function (lhs, rhs) { return lhs - rhs; },
        "*": function (lhs, rhs) { return lhs * rhs; },
        "/": function (lhs, rhs) { return lhs / rhs; },
    }
