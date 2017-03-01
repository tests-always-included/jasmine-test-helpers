"use strict";

module.exports = () => {
    var mock;

    /* This is the way the Jasmine object will be
     * pre version 2.
     */
    mock = {
        Env: {
            prototype: {
                afterEach: () => {},
                beforeEach: () => {},
                iit: () => {},
                it: () => {},
                xit: () => {}
            }
        }
    };

    return mock;
};
