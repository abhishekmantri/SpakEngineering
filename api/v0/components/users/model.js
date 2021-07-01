const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const users = {
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	contact: {
		type: String
	},
	gender: {
		type: String
	},
	address: {
		type: String
	},
	country: {
		type: String
	}
};

const UsersSchema = function () {
	const baseSchema = new mongoose.Schema(users);
	baseSchema.plugin(uniqueValidator);
	return baseSchema;
};

const userList = UsersSchema();
const UsersModel = mongoose.model("users", userList);

module.exports = {
	users: UsersModel
};
