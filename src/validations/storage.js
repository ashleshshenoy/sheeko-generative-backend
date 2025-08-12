const Joi = require("joi");
const {SUBBUCKET_PATH} = require("../constants/storage");

// Validation schema for generating presigned upload URL
const postStorageValidation = Joi.object({
	fileName: Joi.string()
		.required()
		.messages({
			"string.base": "File name must be a string.",
			"string.empty": "File name is required.",
			"any.required": "File name is required."
		}),
	
	path: Joi.string()
		.valid(...Object.keys(SUBBUCKET_PATH))
		.required()
		.messages({
			"string.base": "Path must be a string.",
			"any.only": `Path must be one of: ${Object.keys(SUBBUCKET_PATH).join(", ")}.`,
			"any.required": "Path is required."
		}),
	
	contentType: Joi.string()
		.optional()
		.messages({
			"string.base": "Content type must be a string."
		})
}).unknown(false);


module.exports = {
	postStorageValidation,
};