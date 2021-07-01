/* eslint-env node */
/* eslint-disable no-console */

"use strict";
/**
 * This module contains all the helper functions required by all the controller functions
 */

/**
 * Dependencies
 */
const _ = require("lodash");
const mw = require("../mw-util");
const config = require("../config");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient(6379, "localhost");
const { users } = require("../../users/model");

/**
 * Adds commmon middlewares in route
 * @param  {Array} middlewares functions to be executed
 * @param  {Boolean} applyDefaultMiddlewares default middlewares or custom
 *
 * @return a middleware function
 */
function routeMiddleware(middlewares, applyDefaultMiddlewares) {
	return (req, res, next) => {
		if (applyDefaultMiddlewares) {
			mw([
				// more middlewares
				middlewares[0]
				// more middlewares
			])(req, res, next);
		} else {
			mw(middlewares)(req, res, next);
		}
	};
}

function ensureAuthenticated(req, res, next) {
	const token = req.headers.authorization;
	if (!token) return res.status(401).send({ auth: false, message: "No token provided." });

	redisClient.get(token, (err, data) => {
		if (err) {
			throw err;
		}
		if (data) {
			return res.status(401).send({ auth: false, message: "Unauthorized." });
		} else {
			jwt.verify(token, config.HASH_PASS, function (err, decoded) {
				if (err) return res.status(401).send({ auth: false, message: "Unauthorized" });
				users.findOne({ _id: decoded.id }).then(user => {
					req.user = user;
					next();
				});
			});
		}
	});
}

/**
 * Exports the helper functions
 */
module.exports = {
	routeMiddleware,
	ensureAuthenticated
};
