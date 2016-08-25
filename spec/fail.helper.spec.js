/* eslint-disable no-undefined */

"use strict";

describe("fail.helper", () => {
    var expectMock;

    beforeEach(() => {
        expectMock = require("./mock/expect-mock");
    });
    it("expects jasmine.fail to exist", () => {
        require("../lib/fail.helper");
        expect(jasmine.fail).toEqual(jasmine.any(Function));
    });
    describe("checking for fail", () => {
        beforeEach(() => {
            require("../lib/fail.helper");
        });
        it("should fail when arguments are the same", () => {
            jasmine.fail(false, false, expectMock);
        });
        it("should fail when first argument is null", () => {
            jasmine.fail(null, false, expectMock);
        });
        it("should fail when first argument is undefined", () => {
            jasmine.fail(undefined, false, expectMock);
        });
        it("should fail when second argument is undefined", () => {
            jasmine.fail(false, undefined, expectMock);
        });
        it("should fail when second argument is null", () => {
            jasmine.fail(false, null, expectMock);
        });
    });
});
