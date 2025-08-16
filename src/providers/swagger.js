const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Express API with Swagger",
			version: "1.6",
			description: "API Documentation for Users",
		},
		components: {
			securitySchemes: {
				Bearer: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				Bearer: [],
			},
		],		
	},
	apis: [
		path.join(__dirname, "./../controllers/**/*.js"),
		path.join(__dirname, "./../routes/**/*.js"),
	],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Remove Bearer auth from /test routes in the generated docs
if (swaggerDocs.paths && swaggerDocs.paths["/test"]) {
  Object.keys(swaggerDocs.paths["/test"]).forEach((method) => {
	swaggerDocs.paths["/test"][method].security = [];
  });
}

module.exports = {
  swaggerDocs,
};