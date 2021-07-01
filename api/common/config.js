"use strict";

const config = {
	API_HOST: process.env.API_HOST,
	API_PORT: process.env.API_PORT,
	MONGO_HOST: process.env.MONGO_HOST,
	MONGO_PORT: process.env.MONGO_PORT,
	MONGO_USER: process.env.MONGO_USER,
	MONGO_PASS: process.env.MONGO_PASSWORD,
	HASH_PASS: process.env.HASH_PASS || "qwertyuiop"
};
module.exports = config;
