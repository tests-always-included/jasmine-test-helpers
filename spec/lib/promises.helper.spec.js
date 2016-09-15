/* eslint-disable no-underscore-dangle */
"use strict";

describe("promises.helper", () => {
    var check, mockRequire;

    mockRequire = require("mock-require");

    /**
     * Provides a way of easily passing in a mock Jasmine environment.
     *
     * @param {string} filePath
     * @param {number} versionNumber
     * @return {Object}
     */
    function versionTestHelper(filePath, versionNumber) {
        var mock, oldJasmine;

        /**
         * Resets Jasmine in the global namespace to the actual Jasmine, rather
         * than a mock. Without this, the other spec files will fail.
         */
        function cleanup() {
            global.jasmine = oldJasmine;
        }

        oldJasmine = global.jasmine;
        mock = mockRequire.reRequire(`../mock/jasmine${versionNumber}-mock.js`)();

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
        var jasmineMock;

        describe("Jasmine versions less than 2", () => {
            beforeEach(() => {
                jasmineMock = versionTestHelper("../../lib/promises.helper.js", 1).currentEnv_;
            });
            it("has patched the methods", () => {
                expect(jasmineMock.patchedForPromises).toBe(true);
                expect(jasmineMock.afterEach.patchedForPromises).toBe(true);
                expect(jasmineMock.beforeEach.patchedForPromises).toBe(true);
                expect(jasmineMock.iit.patchedForPromises).toBe(true);
                expect(jasmineMock.it.patchedForPromises).toBe(true);
                expect(jasmineMock.xit.patchedForPromises).toBe(true);
            });
        });
        describe("Jasmine versions 2 and up", () => {
            beforeEach(() => {
                jasmineMock = versionTestHelper("../../lib/promises.helper.js", 2).currentEnv_;
            });
            it("has patched the methods", () => {
                expect(jasmineMock.patchedForPromises).toBe(true);
                expect(jasmineMock.afterEach.patchedForPromises).toBe(true);
                expect(jasmineMock.beforeEach.patchedForPromises).toBe(true);
                expect(jasmineMock.fit.patchedForPromises).toBe(true);
                expect(jasmineMock.it.patchedForPromises).toBe(true);
                expect(jasmineMock.xit.patchedForPromises).toBe(true);
            });
        });
    });
});
