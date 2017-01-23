"use strict";

module.exports = (realJasmine) => {
    var mock;

    /**
     * An alternative mock of Jasmine for version that did away with the
     * prototypal methods
     */
    function JasmineEnv() {
        this.afterEach = () => {};
        this.beforeEach = () => {};
        this.fit = () => {};
        this.it = () => {};
        this.xit = () => {};
    }

    mock = jasmine.createSpyObj("jasmine-nonprototypal", [
        "getEnv"
    ]);
    mock.getEnv.andReturn(new JasmineEnv());
    mock.Env = JasmineEnv;
    mock.util = realJasmine.util;

    return mock;
};
