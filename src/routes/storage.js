const express = require("express");
const { generatePresignedPutUrl } = require("../controllers/storage/post");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     StorageUploadRequest:
 *       type: object
 *       required:
 *         - fileName
 *         - path
 *       properties:
 *         fileName:
 *           type: string
 *           description: Name of the file to upload
 *           example: "document.pdf"
 *         path:
 *           type: string
 *           enum: ["RESOURCE"]
 *           description: Storage path category
 *           example: "RESOURCE"
 *         contentType:
 *           type: string
 *           description: MIME type of the file (optional)
 *           example: "application/pdf"
 *     
 *     StorageUploadResponse:
 *       type: object
 *       properties:
 *         uploadUrl:
 *           type: string
 *           description: Presigned URL for uploading
 *           example: "https://bucket.s3.amazonaws.com/path/file?X-Amz-Algorithm=..."
 *         bucket:
 *           type: string
 *           description: S3 bucket name
 *           example: "sheek-backend"
 *         key:
 *           type: string
 *           description: S3 object key
 *           example: "dev/resource/uuid-filename.pdf"
 *         fileName:
 *           type: string
 *           description: Generated unique filename
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf"
 *         path:
 *           type: string
 *           description: User-specified path
 *           example: "RESOURCE"
 *         subbucketPath:
 *           type: string
 *           description: Actual S3 subbucket path
 *           example: "dev/resource"
 *         expiresIn:
 *           type: number
 *           description: URL expiration time in seconds
 *           example: 7200
 *         contentType:
 *           type: string
 *           description: File content type (if provided)
 *           example: "application/pdf"
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "File name is required"
 * 
 * /api/storage/upload-url:
 *   post:
 *     summary: Generate presigned URL for file upload
 *     description: Creates a presigned URL that allows direct upload to S3 bucket
 *     tags: [Storage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/StorageUploadRequest"
 *     responses:
 *       200:
 *         description: Presigned URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StorageUploadResponse"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
router.post("/upload-url", generatePresignedPutUrl);

module.exports = router;
