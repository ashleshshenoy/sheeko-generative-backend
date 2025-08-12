# Gitt Storage API

A Node.js API for generating presigned URLs for file uploads to AWS S3.

## Features

- Generate presigned URLs for direct S3 uploads
- Swagger API documentation
- File validation and security
- AWS S3 integration
- Express.js server with middleware

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=dev

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET=sheek-backend
```

### 3. Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on port 3000 (or the port specified in your `.env` file).

## API Endpoints

### Storage API

- **POST** `/api/storage/upload-url` - Generate presigned URL for file upload

### Other Endpoints

- **GET** `/` - API information
- **GET** `/health` - Health check
- **GET** `/api-docs` - Swagger documentation

## API Documentation

Once the server is running, you can access the interactive Swagger documentation at:

```
http://localhost:3000/api-docs
```

## Usage Example

### Generate Upload URL

```bash
curl -X POST http://localhost:3000/api/storage/upload-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "document.pdf",
    "path": "RESOURCE",
    "contentType": "application/pdf"
  }'
```

### Response

```json
{
  "uploadUrl": "https://bucket.s3.amazonaws.com/path/file?X-Amz-Algorithm=...",
  "bucket": "sheek-backend",
  "key": "dev/resource/uuid-filename.pdf",
  "fileName": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf",
  "path": "RESOURCE",
  "subbucketPath": "dev/resource",
  "expiresIn": 7200,
  "contentType": "application/pdf"
}
```

## Project Structure

```
src/
├── app.js              # Main Express application
├── routes/
│   └── storage.js      # Storage API routes with Swagger schemas
├── controllers/
│   └── storage/
│       └── post.js     # Storage controller logic
├── validations/
│   └── storage.js      # Input validation schemas
├── constants/
│   └── storage.js      # Storage constants
└── providers/
    ├── index.js        # Provider exports
    ├── aws.js          # AWS S3 integration
    └── swagger.js      # Simplified Swagger configuration
```

## Dependencies

- **Express.js** - Web framework
- **Swagger** - API documentation
- **Joi** - Input validation
- **AWS SDK** - S3 integration
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing 