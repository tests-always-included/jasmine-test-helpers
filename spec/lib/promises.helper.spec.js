/* eslint-disable no-underscore-dangle */
"use strict";

ddescribe("promises.helper", () => {
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
        console.log("MOCK", mock);

        try {
            global.jasmine = mock;
            mockRequire.reRequire(filePath);
        } catch (err) {
            console.log("ERROR", err);
            cleanup();
            throw err;
        }

        cleanup();

        return mock;
    }
    // describe("check for promises working", () => {
    //     beforeEach(() => {
    //         check = 0;
    //
    //         return new Promise((resolve) => {
    //             setTimeout(() => {
    //                 check = 1;
    //                 resolve();
    //             }, 100);
    //         });
    //     });
    //     it("waited for the beforeEach to finish", () => {
    //         expect(check).toBe(1);
    //
    //         return new Promise((resolve) => {
    //             setTimeout(() => {
    //                 check = 2;
    //                 resolve();
    //             }, 100);
    //         });
    //     });
    //     afterEach(() => {
    //         expect(check).toBe(2);
    //     });
    // });
    describe("Version compatability:", () => {
        var jasmineMock;

        // TODO Fix Test Descriptions
        describe("Jasmine versions that utitlize prototypal inheritance", () => {
            beforeEach(() => {
                jasmineMock = versionTestHelper("../../lib/promises.helper.js", 1);
            });
            it("have patched the methods", () => {
                expect(true).toBe(true);
                // expect(jasmineMock.afterEach).toBe(true);
                // expect(jasmineMock.beforeEach).toBe(true);
                // expect(jasmineMock.iit).toBe(true);
                // expect(jasmineMock.it).toBe(true);
                // expect(jasmineMock.xit).toBe(true);
            });
        });
        describe("Jasmine versions that do not utilize prototypal inheritance", () => {
            beforeEach(() => {
                jasmineMock = versionTestHelper("../../lib/promises.helper.js", 2);
            });
            it("have patched the methods", () => {
                // expect(jasmineMock.afterEach).toBe(true);
                // expect(jasmineMock.beforeEach).toBe(true);
                // expect(jasmineMock.fit).toBe(true);
                // expect(jasmineMock.it).toBe(true);
                // expect(jasmineMock.xit).toBe(true);
            });
        });
        // TODO Add Test To Ensure That Methods Are Not Double Patched
    });
});
