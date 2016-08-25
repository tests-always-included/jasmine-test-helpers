Contributing
============

A guide to contributing to Node Test Helpers.

Preparing to Fork
-----------------
The first thing you'll want to do is making sure your IDE/editor of choice has a few things:

1. [ESLint] is installed and you can utilize the [ESLint] configuration created in this repo. If you are unfamiliar with [ESLint], check out the site and see how great it is at keeping code consistent and checking for bad lines of code.

2. [EditorConfig] is installed. Again, if unfamiliar with this tool, please take a few moments to familiarize yourself with it as this is also a handy tool.

Forking the Repository
----------------------
1. Fork the repository from [https://github/tests-always-included/jasmine-node-helpers](https://github/tests-always-included/jasmine-node-helpers). Please do not fork from a fork.

2. Create a branch off of `master`. You don't want to work on `master` as this can cause issues later on.

3. Write the code as you normally would, but make sure to adhere to the guidelines set out in the [ESLint] and [EditorConfig] guides.
    * You should also include JSDoc blocks where applicable. [ESLint] will warn you where they should be and what is missing from them.

4. Write tests. We want to maintain a 100% code coverage, so your pull request probably won't get approved if something isn't tested. This includes `else` branches of `if` statements as well.
    * Make sure that code coverage stays at 100%. We use [Codecov] to check for this. When running `npm test` a report will be generated and put into the `coverage` folder. If you're not familiar with [Codecov] and coverage reports, take some time to look at the [Codecov] and all it offers.

5. Submit a pull request at [https://github.com/tests-always-included/jasmine-node-helpers/pulls](https://github.com/tests-always-included/jasmine-node-helpers/pulls).
    * Please give an explanation of what you did and why. This doesn't need to be a novel, but we'd like to know the thought process on what is being done so we understand the code a little more.
    * If approved, your code will be pulled into the `master` branch of Node Test Helpers.
    * We squash commits from requests, so all your commits will be compiled into one commit when going in the `master` branch.

[Codecov]: https://codecov.io/
[EditorConfig]: http://editorconfig.org/
[ESLint]: http://eslint.org/
