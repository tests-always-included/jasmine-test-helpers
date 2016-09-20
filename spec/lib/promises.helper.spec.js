"use strict";

describe("promises.helper", () => {
    var check, mockRequire;

    mockRequire = require("mock-require");

    /**
     * Checks that an array of methods has been patched.
     *
     * @param {Object} env
     * @param {Array} methods
     */
    function testForPatching(env, methods) {
        methods.forEach((method) => {
            expect(env[method].patchedForPromises).toBe(true);
        });
    }


    /**
     * Provides a way of easily passing in a mock Jasmine environment.
     *
     * @param {string} filePath
     * @param {number} version
     * @param {Object} [optionalMock] Makes sure patching happens only once.
     * @return {Object}
     */
    function versionTestHelper(filePath, version, optionalMock) {
        var mock, oldJasmine;

        /**
         * Resets Jasmine in the global namespace to the actual Jasmine, rather
         * than a mock. Without this, the other spec files will fail.
         */
        function cleanup() {
            global.jasmine = oldJasmine;
        }

        oldJasmine = global.jasmine;

        if (optionalMock) {
            mock = optionalMock;
        } else {
            mock = mockRequire.reRequire(`../mock/jasmine-${version}-mock.js`)();
        }

        try {
            global.jasmine = mock;
            mockRequire.reRequire(filePath);
        } catch (err) {
            cleanup();
            throw err;
        }

        cleanup();

        return mock;
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
        describe("A Jasmine version that utitlize prototypal inheritance", () => {
            var jasmineMock;

            beforeEach(() => {
                jasmineMock = versionTestHelper("../../lib/promises.helper.js", "prototypal").Env.prototype;
            });
            it("has patched methods", () => {
                var methods;

                methods = [
                    "afterEach",
                    "beforeEach",
                    "iit",
                    "it",
                    "xit"
                ];
                testForPatching(jasmineMock, methods);
            });
        });
        describe("A Jasmine version that doesn't utilize prototypal inheritance", () => {
            var jasmineMock;

            beforeEach(() => {
                jasmineMock = versionTestHelper("../../lib/promises.helper.js", "nonprototypal").Env;
            });
            it("has patched methods", () => {
                var methods;

                methods = [
                    "afterEach",
                    "beforeEach",
                    "fit",
                    "it",
                    "xit"
                ];
                testForPatching(jasmineMock, methods);
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
