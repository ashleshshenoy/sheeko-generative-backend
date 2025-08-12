// src/utils/errorMessages.js
class HttpError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.name = "HttpError";
		this.statusCode = statusCode;
      
		// Ensure the stack trace is correctly captured
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpError);
		}
	}
}



module.exports = {
	HttpError
};
