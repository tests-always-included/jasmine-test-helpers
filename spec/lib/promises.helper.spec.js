"use strict";

describe("promises.helper", () => {
    var check, mockRequire;

    mockRequire = require("mock-require");

    /**
     * Provides a way of easily passing in a mock Jasmine environment.
     *
     * @param {string} filePath
     * @param {number} version
     * @param {Object} optionalMock Only passed in to test that patching
     * doesn't occur twice.
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
        describe("Jasmine versions that utitlize prototypal inheritance", () => {
            var jasmineMock;

            beforeEach(() => {
                jasmineMock = versionTestHelper("../../lib/promises.helper.js", "prototypal").Env.prototype;
            });
            it("have patched the methods", () => {
                expect(jasmineMock.afterEach.patchedForPromises).toBe(true);
                expect(jasmineMock.beforeEach.patchedForPromises).toBe(true);
                expect(jasmineMock.iit.patchedForPromises).toBe(true);
                expect(jasmineMock.it.patchedForPromises).toBe(true);
                expect(jasmineMock.xit.patchedForPromises).toBe(true);
            });
        });
        describe("Jasmine versions that do not utilize prototypal inheritance", () => {
            var jasmineMock;

            beforeEach(() => {
                jasmineMock = versionTestHelper("../../lib/promises.helper.js", "nonprototypal").Env;
            });
            it("have patched the methods", () => {
                expect(jasmineMock.afterEach.patchedForPromises).toBe(true);
                expect(jasmineMock.beforeEach.patchedForPromises).toBe(true);
                expect(jasmineMock.fit.patchedForPromises).toBe(true);
                expect(jasmineMock.it.patchedForPromises).toBe(true);
                expect(jasmineMock.xit.patchedForPromises).toBe(true);
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
        mockRequire.reRequire("../../lib/promises.helper.js");
        done();
    });
});
