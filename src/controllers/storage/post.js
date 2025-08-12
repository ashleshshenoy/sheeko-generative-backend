const { generatePresignedUploadUrl, DEFAULT_BUCKET } = require("../../providers/aws");
const { postStorageValidation } = require("../../validations/storage");
const {SUBBUCKET_PATH} = require("../../constants/storage");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { HttpError } = require("./../../utils/http");


/**
 * @desc Generate presigned URL for uploading a file to S3
 */
const generatePresignedPutUrl = async (req, res, next) => {
	try {
		// Validate request body
		const { error } = postStorageValidation.validate(req.body);
		if (error) {
			return next(new HttpError(error.details[0].message, 400));
		}

		const { fileName, contentType, path: userPath } = req.body;
		const bucket = DEFAULT_BUCKET;
		const expiresIn = 7200; // Default 1 hour

		// Get the subbucket path based on user input
		const subbucketPath = SUBBUCKET_PATH[userPath];
		if (!subbucketPath) {
			return next(new HttpError("Invalid path specified", 400));
		}

		// Generate unique key with subbucket path
		const fileExtension = path.extname(fileName);
		const uniqueFileName = `${uuidv4()}${fileExtension}`;
		const key = `${subbucketPath}/${uniqueFileName}`;

		// Generate presigned URL for uploading the file
		const presignedUrl = await generatePresignedUploadUrl(key, expiresIn);

		res.status(200).json({
			uploadUrl: presignedUrl,
			bucket,
			key,
			fileName: uniqueFileName,
			path: userPath,
			subbucketPath,
			expiresIn,
			...(contentType && { contentType })
		});

	} catch (error) {
		return next(new HttpError(`Failed to generate upload URL: ${error.message}`, 500));
	}
};

module.exports = {
	generatePresignedPutUrl
};