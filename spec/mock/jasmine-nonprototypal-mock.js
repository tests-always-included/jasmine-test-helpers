"use strict";

module.exports = (realJasmine) => {
    var mock;

    /**
     * An alternative mock of Jasmine for version that did away with the
     * prototypal methods.
     *
     * This is the way the Jasmine object will appear post version 2.
     */
    function JasmineEnv() {
        this.afterAll = () => {};
        this.afterEach = () => {};
        this.beforeAll = () => {};
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
