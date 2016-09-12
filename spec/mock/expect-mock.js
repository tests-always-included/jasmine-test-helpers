"use strict";

module.exports = (thing) => {
    /**
     * Creates a fake object to include toBe so we can test
     * an expect calls toBe.
     *
     * @return {Object}
     */
    function expect() {
        var mock;

        mock = {};
        mock.toBe = jasmine.createSpy("mock.toBe").and.callFake(() => {
            return true;
        });

        return mock;
    }

    return expect(thing);
};
