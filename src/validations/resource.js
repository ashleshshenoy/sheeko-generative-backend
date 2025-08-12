const Joi = require("joi");

// Validation schema for creating a resource
const postResourceValidation = Joi.object({
	fileUrl: Joi.string()
		.uri()
		.required()
		.messages({
			"string.base": "File URL must be a string.",
			"string.empty": "File URL is required.",
			"string.uri": "File URL must be a valid URI.",
			"any.required": "File URL is required."
		}),
	
	title: Joi.string()
		.required()
		.trim()
		.min(1)
		.max(255)
		.messages({
			"string.base": "Title must be a string.",
			"string.empty": "Title is required.",
			"string.min": "Title must be at least 1 character long.",
			"string.max": "Title cannot exceed 255 characters.",
			"any.required": "Title is required."
		})
}).unknown(false);

module.exports = {
	postResourceValidation,
}; 