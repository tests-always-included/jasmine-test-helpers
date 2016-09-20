"use strict";

module.exports = () => {
    var mock;

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
