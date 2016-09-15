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
    jasmineEnv.afterEach = handlePromise(0, jasmineEnv.afterEach);
    jasmineEnv.beforeEach = handlePromise(0, jasmineEnv.beforeEach);

    if (jasmineEnv.fit) {
        jasmineEnv.fit = handlePromise(1, jasmineEnv.fit);
    } else {
        jasmineEnv.iit = handlePromise(1, jasmineEnv.iit);
    }

    jasmineEnv.it = handlePromise(1, jasmineEnv.it);
    jasmineEnv.xit = handlePromise(1, jasmineEnv.xit);
}
