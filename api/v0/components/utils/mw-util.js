"use strict";
/**
 * Middlewares utility
 */
function callMiddleware(middleware, req, res, next) {
    return () => {
        middleware(req, res, next);
    };
}
module.exports = middlewares => {
    return (req, res) => {
        const stack = [];
        for (let i = middlewares.length - 1; i >= 0; i--) {
            const middleware = middlewares[i];
            if (i === 0) {
                middleware(req, res, stack[stack.length - 1]);
            } else {
                stack.push(callMiddleware(middleware, req, res, stack[stack.length - 1]));
            }
        }
    };
};
