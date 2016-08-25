"use strict";

module.exports = (thing, second) => {
    return () => {
        return (res, req, next) => {
            second.call().then(() => {
                thing.call();

                return next();
            }, () => {
                thing.otherCall();

                return next(false);
            });
        };
    };
};
