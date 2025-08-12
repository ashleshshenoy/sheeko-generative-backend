const { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const REGION = "us-east-1";
const DEFAULT_BUCKET = process.env.AWS_S3_BUCKET || "sheek-backend";

const credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
		
        
// Configure AWS SDK v3 S3 client
const s3Client = new S3Client({
	region: REGION,
	...(credentials && { credentials }),
});



/**
 * @desc Generates a presigned URL for uploading a file to S3.
 */
async function generatePresignedUploadUrl(key, expiresIn = 3600, bucket = DEFAULT_BUCKET) { // Default expires in 1 hour (3600 seconds)
	try {
		const command = new PutObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
		return presignedUrl;
	} catch (error) {
		throw new Error(`Failed to generate presigned upload URL: ${error.message}`);
	}
}



/**
 * @desc Generates a presigned URL for downloading a file from S3.
 */
async function generatePresignedAccessUrl(key, expiresIn = 86400, bucket = DEFAULT_BUCKET) {
	try {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
		return presignedUrl;
	} catch (error) {
		throw new Error(`Failed to generate presigned download URL: ${error.message}`);
	}
}


/**
 * @desc Gets metadata and details of an S3 object from S3 URL
 */
async function getS3ObjectMetadata(key, bucket = DEFAULT_BUCKET) {
	try {

		const command = new HeadObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		const response = await s3Client.send(command);

		console.log(`S3 Object Metadata for ${key}:`, response);
		// Return formatted metadata
		return {
			bucket,
			key: key,
			size: response.ContentLength,
			contentType: response.ContentType,
			ContentLength: response.ContentLength,
			lastModified: response.LastModified,
		};

	} catch (e) {
		throw new Error(`Failed to get S3 object metadata: ${e.message}`);
	}
}


/**
 * @desc Downloads a file from S3 to local filesystem
 */
async function downloadFromS3(key, localFilePath, bucket = DEFAULT_BUCKET) {
	try {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		const response = await s3Client.send(command);

		// Create write stream for local file
		const writeStream = fs.createWriteStream(localFilePath);

		// Pipe S3 response body to local file
		return new Promise((resolve, reject) => {
			response.Body.pipe(writeStream);

			writeStream.on("finish", () => {
				resolve(localFilePath);
			});

			writeStream.on("error", (error) => {
				reject(new Error(`Failed to write downloaded file: ${error.message}`));
			});

			response.Body.on("error", (error) => {
				reject(new Error(`Failed to download from S3: ${error.message}`));
			});
		});

	} catch (error) {
		throw new Error(`Failed to download from S3: ${error.message}`);
	}
}

module.exports = { 
	generatePresignedUploadUrl, 
	generatePresignedAccessUrl,
	getS3ObjectMetadata,
	downloadFromS3,
	DEFAULT_BUCKET,
};
