const express = require("express");
const { supabase   } = require("../providers/supabase");
const { getUserFromToken } = require("../middlewares/auth");
const router = express.Router();

/**
 * @swagger
 * /test/login:
 *   post:
 *     summary: User Login
 *     description: Logs in a user with an email and password, returning an access token if successful.
 *     operationId: loginUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ashleshshenoy09@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "ashlesh09"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful login
 *       '400':
 *         description: Bad request - missing email or password, or invalid input
 *       '401':
 *         description: Unauthorized - Invalid email or password
 *       '500':
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			throw error;
		}

		res.status(200).json({ accessToken: data.session.access_token });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});



/**
 * @swagger
 * /test/user:
 *   get:
 *     summary: Get User Info from Token
 *     description: Retrieves the authenticated user's information based on the provided access token.
 *     security:
 *       - Bearer: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user information
 *       '401':
 *         description: Unauthorized - Invalid or expired token
 *       '500':
 *         description: Internal server error
 */
router.get("/user", getUserFromToken, async (req, res, next) => {
	try {
		res.status(200).json(req.user);
	} catch (e) {
		next(e);
	}
});




module.exports = router;
