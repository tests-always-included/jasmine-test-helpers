"use strict";

describe("promises.helper", () => {
    var check, mockRequire;

    mockRequire = require("mock-require");

    /**
     * Checks that an array of methods has been patched.
     *
     * @param {Object} obj
     * @param {Array} methods
     */
    function testForPatching(obj, methods) {
        methods.forEach((method) => {
            expect(obj[method].patchedForPromises).toBe(true);
        });
    }


    /**
     * Provides a way of easily passing in a mock Jasmine environment.
     *
     * @param {Object} mock
     */
    function versionTestHelper(mock) {
        var oldJasmine;

        /**
         * Resets Jasmine in the global namespace to the actual Jasmine, rather
         * than a mock. Without this, the other spec files will fail.
         */
        function cleanup() {
            global.jasmine = oldJasmine;
        }

        oldJasmine = global.jasmine;

        try {
            global.jasmine = mock;
            mockRequire.reRequire("../../lib/promises.helper.js");
        } catch (err) {
            cleanup();

            throw err;
        }

        cleanup();
    }


    describe("check for promises working", () => {
        beforeEach(() => {
            check = 0;

            return new Promise((resolve) => {
                setTimeout(() => {
                    check = 1;
                    resolve();
                }, 100);
            });
        });
        it("waited for the beforeEach to finish", () => {
            expect(check).toBe(1);

            return new Promise((resolve) => {
                setTimeout(() => {
                    check = 2;
                    resolve();
                }, 100);
            });
        });
        afterEach(() => {
            expect(check).toBe(2);
        });
    });
    describe("Version compatability:", () => {
        describe("A Jasmine version that uses prototypal inheritance", () => {
            var jasmineMock, methods;

            beforeEach(() => {
                jasmineMock = require("../mock/jasmine-prototypal-mock.js")(jasmine);
                versionTestHelper(jasmineMock);
                methods = [
                    "afterEach",
                    "beforeEach",
                    "iit",
                    "it",
                    "xit"
                ];
            });
            it("has patched methods", () => {
                testForPatching(jasmineMock.Env.prototype, methods);
            });
        });
        describe("A Jasmine version that doesn't use prototypal inheritance", () => {
            var jasmineMock, methods;

            beforeEach(() => {
                jasmineMock = require("../mock/jasmine-nonprototypal-mock.js")(jasmine);
                versionTestHelper(jasmineMock);
                methods = [
                    "afterAll",
                    "afterEach",
                    "beforeAll",
                    "beforeEach",
                    "fit",
                    "it",
                    "xit"
                ];
            });
            it("has patched methods", () => {
                var newEnvInstance;

                newEnvInstance = new jasmineMock.Env();
                testForPatching(newEnvInstance, methods);
            });
            it("patches the current environment", () => {
                testForPatching(jasmineMock.getEnv(), methods);
            });
        });
    });
    it("only patches for promises once", () => {
        var jasmineCopy;

        jasmineCopy = jasmine.then;
        mockRequire.reRequire("../../lib/promises.helper.js");
        expect(jasmineCopy).toBe(jasmine.then);
    });
    it("does not patch methods that already handle promises", (done) => {
        done();
    });
});
