"use strict";

module.exports = () => {
    var mock;

    class JasmineEnv {
        constructor() {
            this.afterEach = () => {};
            this.beforeEach = () => {};
            this.fit = () => {};
            this.it = () => {};
            this.xit = () => {};
        }
    }

    mock = {
        Env: JasmineEnv
    };

    return mock;
};
