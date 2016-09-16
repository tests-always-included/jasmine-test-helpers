/* eslint-disable no-underscore-dangle */
"use strict";

function patchMethod(callbackIndex, obj, methodName) {
    var original;

    original = obj[methodName];
    obj[methodName] = function() {
        var args, callback;

        args = [].slice.call(arguments);
        console.log(arguments);
        // console.log("METHODNAME", methodName);
        // console.log("ARGS", args[callbackIndex]);
        callback = args[callbackIndex];

        // Only handle promises if the original callback does not.
        if (!callback.length) {
            console.log("KALJFSDLKASJDLKASJD", methodName);
            args[callbackIndex] = function (done) {
                var result;

                result = callback();
                // console.log(result);

                if (result && result.then && typeof result.then === "function") {
                    result.then(done, done);
                } else {
                    done();
                }
            };
        }

        return original.apply(obj, args);
    };
}


function patchAllMethods(obj) {
    [
        "fit",
        "iit",
        "it",
        "xit"
    ].forEach((methodName) => {
        patchMethod(1, obj, methodName);
    });
    [
        "beforeEach",
        "afterEach"
    ].forEach((methodName) => {
        patchMethod(0, obj, methodName);
    });
}


function wrapConstructor(original) {
    var args, result;

    args = [
        null
    ].concat(arguments);
    // Careful, the concat with arguments may not work
    // and you would need to typecast arguments to an Array using
    // syntax like
    // .... ].concat([].slice.call(arguments));
    result = new (Function.prototype.bind.apply(original, [
        null
    ].concat(args)));
    patchAllMethods(result);

    return result;
}

console.log("Hello, God. It's me, Lucas.");

if (jasmine.Env.prototype.it) {
    console.log("nifty if statement");
    patchAllMethods(jasmine.Env.prototype);
} else {
    console.log("nify else statement");
    jasmine.Env = wrapConstructor(jasmine.Env);
}
