/* eslint-disable no-undefined */

"use strict";

describe("fail.helper", () => {
    var mockRequire, realExpect;

    mockRequire = require("mock-require");

    beforeEach(() => {
        realExpect = expect;
        spyOn(global, "expect").and.returnValue({
            toBe: jasmine.createSpy("expect.toBe")
        });
    });
    it("expects jasmine.fail to exist", () => {
        require("../../lib/fail.helper");
        realExpect(jasmine.fail).toEqual(jasmine.any(Function));
    });
    describe("checking for fail", () => {
        beforeEach(() => {
            require("../../lib/fail.helper");
        });
        it("should fail when arguments are the same", () => {
            jasmine.fail(false, false);
        });
        it("should fail when first argument is null", () => {
            jasmine.fail(null, false);
        });
        it("should fail when first argument is undefined", () => {
            jasmine.fail(undefined, false);
        });
        it("should fail when second argument is undefined", () => {
            jasmine.fail(false, undefined);
        });
        it("should fail when second argument is null", () => {
            jasmine.fail(false, null);
        });
    });
    describe("patching for fail", () => {
        it("only happens once", () => {
            var jasmineCopy;

            jasmineCopy = jasmine.fail;
            mockRequire.reRequire("../../lib/fail.helper.js");
            expect(jasmineCopy).toBe(jasmine.fail);
        });
    });
});
