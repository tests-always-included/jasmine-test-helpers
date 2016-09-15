/* eslint-disable no-underscore-dangle */
"use strict";

var jasmineEnv;

/**
 * Wrap what is passed into one of the global functions in order to handle
 * promises.
 *
 * @param {number} parameterIndex
 * @param {Function} original The original global function
 * @return {Function} what should replace the global function
 */
function handlePromise(parameterIndex, original) {
    var fn;

    fn = function () {
        var args, callback;

        args = [].slice.call(arguments);
        callback = args[parameterIndex];

        // Only handle promises if the original callback does not.
        if (!callback.length) {
            args[parameterIndex] = function (done) {
                var result;

                result = callback();

                if (result && result.then && typeof result.then === "function") {
                    result.then(done, done);
                } else {
                    done();
                }
            };
        }

        /* eslint no-invalid-this:"off" */
        original.apply(this, args);
    };

    fn.patchedForPromises = true;

    return fn;
}

jasmineEnv = jasmine.currentEnv_;

if (!jasmineEnv.patchedForPromises) {
    jasmineEnv.patchedForPromises = true;
    [
        "fit",
        "iit",
        "it",
        "xit"
    ].forEach((method) => {
        if (typeof jasmineEnv[method] === "function") {
            jasmineEnv[method] = handlePromise(1, jasmineEnv[method]);
        }
    });
    [
        "beforeEach",
        "afterEach"
    ].forEach((method) => {
        jasmineEnv[method] = handlePromise(0, jasmineEnv[method]);
    });
}
