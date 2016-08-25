"use strict";

if (!jasmine.fail) {
    /**
     * Sets up the scenario to actually fail; `actual` and `expected`
     * need to never match.
     *
     * @param {string} actual
     * @param {string} expected
     * @param {Function} expectFn used just for testing purposes
     */
    jasmine.fail = function (actual, expected, expectFn) {
        if (typeof actual === "undefined") {
            actual = "the code";
        }

        if (typeof expected === "undefined") {
            expected = "something else (this is a forced error)";
        }

        if (actual === expected) {
            actual = true;
            expected = false;
        }

        (expectFn || expect)(actual).toBe(expected);
    };
}
