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
PORT=3000
NODE_ENV=dev

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/gitt

# Supabase Configuration (for authentication)
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# AWS Configuration (for storage)
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

### Resource API

- **POST** `/api/resource` - Create a new resource with OCR content extraction
  - Requires authentication (Bearer token in Authorization header)
  - Automatically downloads PDF from provided URL and extracts text using OCR
  - Stores extracted content in MongoDB

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

### Create Resource with OCR

```bash
curl -X POST http://localhost:3000/api/resource \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_supabase_token_here" \
  -d '{
    "title": "Sample PDF Document",
    "fileUrl": "https://example.com/document.pdf"
  }'
```

### Resource Response

```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f678901234",
    "title": "Sample PDF Document",
    "fileUrl": "https://example.com/document.pdf",
    "userId": "user_uuid_here",
    "content": {
      "pages": ["Page 1 text content...", "Page 2 text content..."],
      "totalPages": 2,
      "extractedAt": "2024-01-15T10:30:00.000Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Project Structure

```
src/
├── app.js              # Main Express application
├── routes/
│   ├── storage.js      # Storage API routes with Swagger schemas
│   └── resource.js     # Resource API routes with Swagger schemas
├── controllers/
│   ├── storage/
│   │   └── post.js     # Storage controller logic
│   └── resource/
│       └── post.js     # Resource controller logic with OCR processing
├── validations/
│   ├── storage.js      # Storage input validation schemas
│   └── resource.js     # Resource input validation schemas
├── models/
│   └── resource.js     # MongoDB Resource model schema
├── middlewares/
│   └── auth.js         # Authentication middleware using Supabase
├── constants/
│   └── storage.js      # Storage constants
└── providers/
    ├── db.js           # Database connection (MongoDB + PostgreSQL)
    ├── ocr.js          # OCR processing using Tesseract.js
    ├── supabase.js     # Supabase client for authentication
    ├── aws.js          # AWS S3 integration
    └── swagger.js      # Simplified Swagger configuration
```

## Dependencies

- **Express.js** - Web framework
- **Swagger** - API documentation
- **Joi** - Input validation
- **Mongoose** - MongoDB ODM
- **Tesseract.js** - OCR text extraction
- **PDF processing** - pdf2pic, pdf-lib for PDF handling
- **Supabase** - Authentication and user management
- **AWS SDK** - S3 integration
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing 