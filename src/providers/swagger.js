// swaggerConfig.js
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
				},
				ApiKeyAuth: { 
					type: "apiKey",
					in: "header",
					name: "x-api-key",
					description: "API Key required for authorization",
				}
			}
		},  
	
	},
	// Correctly include paths to the route and controller files
	apis: [
		path.join(__dirname, "./../controllers/**/*.js"), 
		path.join(__dirname, "./../routes/**/*.js"), 
	],
};
  
// Generate Swagger docs using swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = {
	swaggerDocs
}; 