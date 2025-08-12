const { ResourceModel } = require("../../models/resource");
const { postResourceValidation } = require("../../validations/resource");
const { extractTextPerPage } = require("../../providers/ocr");
const { downloadFromS3, DEFAULT_BUCKET } = require("../../providers/aws");
const { HttpError } = require("../../utils/http");
const fs = require("fs");
const path = require("path");

/**
 * @desc Create a new resource with OCR content extraction
 */
const createResource = async (req, res, next) => {
	let tempFilePath;
	try {
		// Validate request body
		const { error } = postResourceValidation.validate(req.body);
		if (error) {
			return next(new HttpError(error.details[0].message, 400));
		}

		const { fileUrl, title } = req.body;
		const userId = req.user.id;

		// Extract S3 key from the fileUrl (assuming it's an S3 URL)
		// Example: https://bucket-name.s3.region.amazonaws.com/path/to/file.pdf
		const urlParts = fileUrl.split(".com/");
		if (urlParts.length !== 2) {
			return next(new HttpError("Invalid S3 URL format", 400));
		}
		
		const s3Key = urlParts[1];
		const tempFileName = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`;
		tempFilePath = path.join(__dirname, "../../../temp", tempFileName);
		
		// Create temp directory if it doesn't exist
		const tempDir = path.dirname(tempFilePath);
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir, { recursive: true });
		}

		// Download the file from S3 using AWS provider
		try {
			await downloadFromS3(s3Key, tempFilePath, DEFAULT_BUCKET);
		} catch (downloadError) {
			return next(new HttpError(`Failed to download file from S3: ${downloadError.message}`, 500));
		}

		// Extract text content using OCR
		const content = await extractTextPerPage(tempFilePath);
		
		// Create the resource
		const resource = new ResourceModel({
			title,
			fileUrl,
			userId,
			content: {
				pages: content,
				totalPages: content.length,
				extractedAt: new Date()
			}
		});

		await resource.save();

		res.status(201).json({
			success: true,
			data: {
				id: resource._id,
				title: resource.title,
				fileUrl: resource.fileUrl,
				userId: resource.userId,
				content: resource.content,
				createdAt: resource.createdAt,
				updatedAt: resource.updatedAt
			}
		});

	} catch (error) {
		return next(new HttpError(`Failed to create resource: ${error.message}`, 500));
	} finally {
		// Clean up temporary file in all cases
		if (tempFilePath && fs.existsSync(tempFilePath)) {
			try {
				fs.unlinkSync(tempFilePath);
			} catch (e) {
				console.error(`Failed to delete temp file: ${tempFilePath}`, e);
			}
		}
	}
};



module.exports = {
	createResource
};
