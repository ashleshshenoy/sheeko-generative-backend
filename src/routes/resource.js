const express = require("express");
const router = express.Router();
const { createResource } = require("../controllers/resource");
const { getUserFromToken } = require("../middlewares/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       required:
 *         - title
 *         - fileUrl
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the resource
 *           example: "Sample PDF Document"
 *         fileUrl:
 *           type: string
 *           format: uri
 *           description: URL to the PDF file
 *           example: "https://example.com/document.pdf"
 *     ResourceResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: MongoDB ObjectId of the created resource
 *             title:
 *               type: string
 *               description: The title of the resource
 *             fileUrl:
 *               type: string
 *               description: URL to the PDF file
 *             userId:
 *               type: string
 *               description: ID of the user who created the resource
 *             content:
 *               type: object
 *               properties:
 *                 pages:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of extracted text from each page
 *                 totalPages:
 *                   type: number
 *                   description: Total number of pages in the PDF
 *                 extractedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when OCR extraction was completed
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Create a new resource with OCR content extraction
 *     description: Creates a new resource by downloading a PDF from the provided URL, extracting text content using OCR, and storing it in the database
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *           example:
 *             title: "Sample PDF Document"
 *             fileUrl: "https://example.com/document.pdf"
 *     responses:
 *       201:
 *         description: Resource created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "File URL must be a valid URI."
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to create resource: OCR processing failed"
 */

// POST /api/resource - Create a new resource with OCR content extraction
router.post("/", getUserFromToken, createResource);

module.exports = router;
