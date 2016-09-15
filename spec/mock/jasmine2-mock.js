"use strict";

module.exports = () => {
    var mock;

    mock = {
        currentEnv_: {
            afterEach: () => {},
            beforeEach: () => {},
            fit: () => {},
            it: () => {},
            xit: () => {}
        }
    };

    return mock;
};
