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
        expect(jasmine.Env.prototype.patchedForPromises).toBe(true);
        expect(jasmine.Env.prototype.afterEach.patchedForPromises).toBe(true);
        expect(jasmine.Env.prototype.beforeEach.patchedForPromises).toBe(true);
        expect(jasmine.Env.prototype.iit.patchedForPromises).toBe(true);
        expect(jasmine.Env.prototype.it.patchedForPromises).toBe(true);
        expect(jasmine.Env.prototype.xit.patchedForPromises).toBe(true);
    });
});
