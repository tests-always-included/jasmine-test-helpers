"use strict";

describe("promises.helper", () => {
    var check;

    require("../lib/promises.helper");
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
    it("has patched the methods", () => {
        expect(jasmine.getEnv().patchedForPromises).toBe(true);
        expect(jasmine.getEnv().afterEach.patchedForPromises).toBe(true);
        expect(jasmine.getEnv().beforeEach.patchedForPromises).toBe(true);
        expect(jasmine.getEnv().fit.patchedForPromises).toBe(true);
        expect(jasmine.getEnv().it.patchedForPromises).toBe(true);
        expect(jasmine.getEnv().xit.patchedForPromises).toBe(true);
    });
});
