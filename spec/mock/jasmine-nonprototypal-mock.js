"use strict";

module.exports = () => {
    var mock;

    /**
     * An alternative mock of Jasmine for version that did away with the
     * prototypal methods
     */
    class JasmineEnv {
        /**
         * Mocks methods that need to be wrapped and patched by the promises
         * helper.
         */
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
