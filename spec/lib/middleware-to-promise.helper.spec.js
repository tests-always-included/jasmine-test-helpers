"use strict";

describe("middleware-to-promise.helper", () => {
    var factory, mockCall;

    beforeEach(() => {
        var secondMock;

        mockCall = jasmine.createSpyObj("mock", [
            "call",
            "otherCall"
        ]);
        mockCall.call.andCallFake(() => {
            return Promise.resolve();
        });
        mockCall.otherCall.andCallFake(() => {
            return Promise.reject();
        });
        factory = (secondResult) => {
            secondMock = jasmine.createSpyObj("secondMock", [
                "call"
            ]);
            secondMock.call.andCallFake(() => {
                if (secondResult === "pass") {
                    return Promise.resolve();
                }

                return Promise.reject();
            });

            return require("../mock/middleware-mock")(mockCall, secondMock);
        };
    });
    it("expects jasmine.middlewareToPromise to exist", () => {
        expect(jasmine.middlewareToPromise).toBeDefined();
    });
    describe("sets up mock middleware", () => {
        it("should pass and run call", () => {
            var middlewareAsync;

            middlewareAsync = jasmine.middlewareToPromise(factory("pass")());

            return middlewareAsync().then(() => {
                expect(mockCall.call).toHaveBeenCalled();
            });
        });
        it("should fail and run otherCall", () => {
            var middlewareAsync;

            middlewareAsync = jasmine.middlewareToPromise(factory("fail")());

            return middlewareAsync().then(jasmine.fail, () => {
                expect(mockCall.otherCall).toHaveBeenCalled();
            });
        });
        it("should fail completely and not run any calls", () => {
            var middlewareAsync;

            middlewareAsync = jasmine.middlewareToPromise("failToMakePromise");

            return middlewareAsync().then(jasmine.fail, () => {
                expect(mockCall.otherCall).not.toHaveBeenCalled();
                expect(mockCall.call).not.toHaveBeenCalled();
            });
        });
    });
});
