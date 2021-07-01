"use strict";
const { routeMiddleware, ensureAuthenticated } = require("../utils/helpers/common_helper");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../../common/config");
const _ = require("lodash");
const redis = require("redis");
const redisClient = redis.createClient(6379, "localhost");

const { users } = require("./model");

async function login(req, res, next) {
	try {
		const reqObj = {
			username: _.get(req.swagger.params, "username.value", ""),
			password: _.get(req.swagger.params, "password.value", "")
		};
		users.findOne({ username: reqObj.username }, function (err, user) {
			if (err) return res.status(500).send("Error on the server.");
			if (!user) return res.status(404).send("No user found.");

			const passwordIsValid = bcrypt.compareSync(reqObj.password, user.password);
			if (!passwordIsValid) return res.status(401).send({ message: "Invalid Password", token: null });

			const token = jwt.sign({ id: user._id }, config.HASH_PASS, {
				expiresIn: 86400 // expires in 24 hours
			});

			res.status(200).send({ auth: true, token: token });
		});
	} catch (error) {
		res.status(500).send({ message: error });
	}
}

async function signup(req, res, next) {
	try {
		const params = req.swagger.params.body.value;
		const pass = bcrypt.hashSync(_.get(params, "password", ""), 8);
		const contact = _.get(params, "contact", "");
		if (contact) {
			if (!contact.match(/^\d{10}$/)) {
				res.status(400).send({ message: "Invalid Contact Number" });
			}
		}
		const reqObj = {
			username: _.get(params, "username", ""),
			password: pass,
			name: _.get(params, "name", ""),
			gender: _.get(params, "gender", ""),
			contact: _.get(params, "contact", ""),
			address: _.get(params, "address", ""),
			country: _.get(params, "country", "")
		};
		const newUser = new users(reqObj);
		await newUser.save();
		res.status(200).send({ message: "User created" });
	} catch (err) {
		res.status(500).send({ message: err });
	}
}

async function logout(req, res, next) {
	try {
		const token = req.headers.authorization;
		await redisClient.setex(token, 86400, "Invalid");
		res.status(200).send({ message: "User logged Out" });
	} catch (err) {
		res.status(500).send({ message: err });
	}
}

async function searchUsers(req, res, next) {
	try {
		const params = req.swagger.params;
		let query = {};
		const name = _.get(params, "name.value", "");
		const contact = _.get(params, "contact.value", "");
		if (name) {
			const search_regex = new RegExp(name, "i");
			query["name"] = { $regex: search_regex };
		}
		if (contact) {
			const search_regex = new RegExp(contact, "i");
			query["contact"] = { $regex: search_regex };
		}
		console.log(query);
		const result = await users.find(query, { password: 0, username: 0 });
		res.status(200).send({ data: result });
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: err });
	}
}

module.exports = {
	login: routeMiddleware([login], false),
	signup: routeMiddleware([signup], false),
	searchUsers: routeMiddleware([ensureAuthenticated, searchUsers], false),
	logout: routeMiddleware([ensureAuthenticated, logout], false)
};
