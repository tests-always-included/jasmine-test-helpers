"use strict";

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

            // Only handle promises if the original callback does not.
            if (!callback.length) {
                args[callbackIndex] = function (done) {
                    var result;

                    result = callback();

                    if (result && result.then && typeof result.then === "function") {
                        result.then(done, done);
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
    [
        "beforeEach",
        "afterEach"
    ].forEach((methodName) => {
        patchMethod(0, obj, methodName);
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
    var args, result;

    args = [
        null
    ].concat(arguments);
    result = new (Function.prototype.bind.apply(original, [
        null
    ].concat(args)));
    patchAllMethods(result);

    return result;
}

if (jasmine.Env.prototype.it) {
    patchAllMethods(jasmine.Env.prototype);
} else {
    jasmine.Env = wrapConstructor(jasmine.Env);
}
