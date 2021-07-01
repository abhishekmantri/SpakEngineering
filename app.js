"use strict";

/**
 * Dependencies
 */
const express = require("express");
const logStr = "App module";

var SwaggerExpress = require("swagger-express-mw");
var app = express();
var bodyParser = require("body-parser");

/**
 * Load APM
 */
// const apm_helper = require('./api/common/apm_helper');

/**
 * Serve Swagger docs
 */
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./api/swagger/swagger.json");
const showExplorer = true;
const options = {};
const customCss = "#swagger-ui { margin: auto; width: 75% }";
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, showExplorer, options, customCss));

const config = {
	appRoot: __dirname
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
	if (err) {
		throw err;
	}

	// install middleware
	swaggerExpress.register(app);

	// error handler
	app.use(function (err, req, res) {
		res.status(err.status || 500);
		console.log("%s : Server error", logStr, err);
		return res.json({
			message: err.message
		});
	});
});

// const createError = require('http-errors');
// const passport = require('passport');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
// const helmet = require('helmet');
// const cors = require('cors');
// const fileUpload = require('express-fileupload');

// const soadb = require('./api/common/soadb');
require("./api/common/db-init")();
// soadb.connectToServer();
// soadb.connectToPreliminarScoring()
// app.use(passport.initialize());
// require('./api/common/strategy-init')();

/**
 * Add middlewares at app level
 */

// app.use(express.json());
//app.use(express.urlencoded({
//  extended: false
//}));
//app.use(cookieParser());
// app.use(cors());
// app.use(helmet());
app.use(
	bodyParser.json({
		limit: "50mb"
	})
);

// app.use(bodyParser.urlencoded({
//   limit: '50mb',
//   parameterLimit: 100000,
//   extended: true
// }));
// app.use(fileUpload())

app.set("x-powered-by", false);

module.exports = app;
