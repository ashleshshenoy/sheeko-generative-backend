// Middleware to authenticate and get user details
const { HttpError } = require("../utils/http");
const { supabase } = require("./../providers/supabase");

/**
 * @desc Middleware to extract and validate user from the provided authorization token
 */
const getUserFromToken = async (req, res, next) => {
	const token = req.headers.authorization?.split("Bearer ")[1]; 
	
	if (!token) {
		return next(new HttpError("No token provided", 401));
	}
    
	try {
		// Decode the token using the secret
		const { data } = await supabase.auth.getUser(token);
		
		if(!data.user){
			return next(new HttpError("Invalid token provided or expired", 401));
		}
		req.user = data.user;
		return next();

	} catch (e) {
		// Decoded token is not a valid one 
		return next(e);
	}
};


module.exports = {
	getUserFromToken
};