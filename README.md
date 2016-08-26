Jasmine-Node Helpers
====================

*Helping you test your [Node.js] applications, one helper at a time.*

[![Build Status][travis-image]][Travis CI]
[![Dependencies][dependencies-image]][Dependencies]
[![Dev Dependencies][devdependencies-image]][Dev Dependencies]
[![codecov.io][codecov-image]][Code Coverage]

About
-----

This contains a series of [Jasmine] 1.3 helpers when using [Jasmine-Node] to facilitate testing certain functionality more easily. These help to detect when a test fails but should have passed, turn middleware into a promise and makes it easier to use promises in tests. More explanation is below for each helper.

*Note: If you are not using [Jasmine-Node] these helpers aren't going to help your testing suite very much.*

How to Use
----------

Include the package in your `package.json` file.

    npm install --save-dev jasmine-test-helpers

Then you need to be able to include the helper in your testing directory or where you'd like to run tests.

You can do this by creating a symbolic link to files contained. You'll want to link to the files and not the folder. [Jasmine] doesn't seem to pick up on the files if only the folder is linked. Below is an example of setting up a symbolic link. Make sure to include the folder in your `.gitignore` file so you don't commit the files as this folder will show up in your status.

    // Linux/MacOS
    mkdir ./path/to/project/test-folder/jasmine-node-helpers

    cd /path/to/project
    ln -s ./node_modules/jasmine-node-helpers/lib/* ./test-folder/jasmine-node-helpers/

    // Windows
    // If you can figure out how to make symlink work, good on you, make a [fork](CONTRIBUTING.md) and update those instructions please.

`jasmine.fail([actual], [expected])`
------------------------------------

This is most useful when testing a promise is getting the reject as expected, and when you'd like the test to fail if the promise is resolved rather than rejected. Parameters can be passed as well if they make sense for the test, but don't regularly need to be used as this will cause a failure of the test if called.

    describe("a suite", () => {
        it("rejects the returned promise", () => {
            return someClass.someMethodAsync().then(jasmine.fail, () => {
                expect(someVar).toBe("this");
            });
        });
    });

`jasmine.middlewareToPromise(middlewareFunction)`
-------------------------------------------------

Used when wanting to make a piece of middleware used in setting up a node server and you want to make it to be run synchronously with your tests to get a response back straight away without waiting for a real promise to resolve.

The middleware can be written in a traditional style using a callback like `done` or `next`.

    var middleware, middlewareAsync, req, res;

    middleware = require("../lib/your-favorite-middleware");
    middlewareAsync = jasmine.middlewareToPromise(middleware);

    beforeEach(() => {
        req = makeFakeRequestObject();  // You write this
        res = makeFakeResponseObject();  // You write this
    });
    describe("a suite", () => {
        it("is easier with promises", () => {
            // If an argument is passed, the promise is rejected.
            // If the middleware throws, the promise is rejected.
            // The promise helper automatically handles both.
            // Just remember to `return` the promise.
            return middlewareAsync(req, res).then(() => {
                expect(res.send).toHaveBeenCalled();
            });
        });
        it("works in a traditional way", (done) => {
            // You must manually ensure the middleware does not throw.
            // Also you must manually ensure no argument was passed to
            // the `done` / `next` callback.
            // Don't forget to call `done()` when everything's complete.
            function doneWithMiddleware(arg) {
                expect(arg).not.toBeDefined();
                expect(res.send).toHaveBeenCalled();
                done();
            }
            jasmine.expect(() => {
                middleware(req, res, doneWithMiddleware);
            }).not.toThrow();
        });
    });

Promises helper
---------------

This makes it much easier to use promises in node tests. Instead of having to remember to pass `done` in the `it` part of the testing in [Jasmine], you simple need to return the promise and the rest is handled like normal.

    // Before
    describe("a suite", () => {
        it("does what the test needs to do", (done) => {
            someClass.someMethodAsync().then((result) => {
                expect(result).toBe("this");
            }).then(done, done);
        });
    });

    // After
    describe("a suite", () => {
        it("does what the test needs to do", () => {
            return someClass.someMethodAsync().then((result) => {
                expect(result).toBe("this");
            });
        });
    });

See how much simpler that is? You won't need to add `done` to the `it` or accidentally put `done` in the `describe` and wonder why your tests are failing when you've been writing tests all day.

[Code Coverage]: https://codecov.io/github/tests-always-included/jasmine-node-helpers?branch=master
[codecov-image]: https://codecov.io/github/tests-always-included/jasmine-node-helpers/coverage.svg?branch=master
[Dev Dependencies]: https://david-dm.org/tests-always-included/jasmine-node-helpers/master#info=devDependencies
[devdependencies-image]: https://david-dm.org/tests-always-included/jasmine-node-helpers/master/dev-status.png
[Dependencies]: https://david-dm.org/tests-always-included/jasmine-node-helpers/master
[dependencies-image]: https://david-dm.org/tests-always-included/jasmine-node-helpers/master.png
[Jasmine]: https://jasmine.github.io/
[Jasmine-Node]: https://www.npmjs.com/package/jasmine-node
[Node.js]: https://nodejs.org
[travis-image]: https://secure.travis-ci.org/tests-always-included/jasmine-node-helpers.png
[Travis CI]: http://travis-ci.org/tests-always-included/jasmine-node-helpers
