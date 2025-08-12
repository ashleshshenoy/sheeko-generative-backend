// src/utils/errorMessages.js
class HttpError extends Error {
	constructor(message, status) {
		super(message);
		this.name = "HttpError";
		this.status = status;
      
		// Ensure the stack trace is correctly captured
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpError);
		}
	}
}



module.exports = {
	HttpError
};
