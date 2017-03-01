"use strict";

var util;

/**
 * Wraps obj[methodName] and handles when a Promise object is returned. If one
 * is returned, it will automatically turn the test into an asynchronous test
 * that finishes when the Promise is resolved. When the promise is rejected the
 * test will be failed.
 *
 * @param {number} callbackIndex
 * @param {Object} obj
 * @param {string} methodName
 */
function patchMethod(callbackIndex, obj, methodName) {
    var original;

    original = obj[methodName];

    if (!original.patchedForPromises) {
        obj[methodName] = function () {
            var args, callback;

            args = [].slice.call(arguments);
            callback = args[callbackIndex];

            // Only handle promises if the original callback does not
            // take the "done" callback itself.
            if (!callback.length) {
                args[callbackIndex] = function (done) {
                    var result;

                    result = callback();

                    if (result && result.then && typeof result.then === "function") {
                        result.then(() => {
                            done();
                        }, (err) => {
                            if (!err) {
                                err = new Error("Unspecified promise rejection");
                            }

                            if (err instanceof Error) {
                                jasmine.fail(`${err.toString()}\n${err.stack}`);
                            } else {
                                jasmine.fail(err.toString());
                            }

                            done();
                        });
                    } else {
                        done();
                    }
                };
            }

            return original.apply(this, args);
        };

        obj[methodName].patchedForPromises = true;
    }
}


/**
 * Batch handling of methods that need to be patched. Accounts for difference
 * in callback index between the various 'it' methods and the rest of the
 * Jasmine methods.
 *
 * @param {Object} obj A Jasmine environment.
 */
function patchAllMethods(obj) {
    [
        "fit",
        "iit",
        "it",
        "xit"
    ].forEach((methodName) => {
        if (typeof obj[methodName] === "function") {
            patchMethod(1, obj, methodName);
        }
    });

    /* beforeAll and afterAll were added in Jasmine 2.1
     * which is why we need to check if the method exists.
     */
    [
        "beforeAll",
        "beforeEach",
        "afterAll",
        "afterEach"
    ].forEach((methodName) => {
        if (typeof obj[methodName] === "function") {
            patchMethod(0, obj, methodName);
        }
    });
}


/**
 * Prepares Jasmine methods for patching if they are of a version that does not
 * utitilize prototypal inheritance.
 *
 * @param {Object} original A Jasmine environment.
 * @return {Object}
 */
function wrapConstructor(original) {
    /**
     * Alternate constructor
     */
    function wrappedEnv() {
        var args;

        args = [].slice.call(arguments);

        /* eslint no-invalid-this:off */
        original.apply(this, args);
        patchAllMethods(this);
    }

    util.inherits(wrappedEnv, original);

    return wrappedEnv;
}

util = require("util");

if (jasmine.Env.prototype.it) {
    /* This condition will happen if we are running
     * anything before version 2.
     */
    patchAllMethods(jasmine.Env.prototype);
} else {
    // Patch the constructor
    jasmine.Env = wrapConstructor(jasmine.Env);

    // Patch existing environment
    patchAllMethods(jasmine.getEnv());
}
