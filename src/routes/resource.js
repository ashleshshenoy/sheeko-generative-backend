const express = require("express");
const router = express.Router();
const { createResource, getResources } = require("../controllers/resource");
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
 *     PaginatedResourceResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: MongoDB ObjectId of the resource
 *               title:
 *                 type: string
 *                 description: The title of the resource
 *               fileUrl:
 *                 type: string
 *                 description: URL to the PDF file
 *               userId:
 *                 type: string
 *                 description: ID of the user who created the resource
 *               content:
 *                 type: object
 *                 properties:
 *                   totalPages:
 *                     type: number
 *                     description: Total number of pages in the PDF
 *                   extractedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when OCR extraction was completed
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *         totalPages:
 *           type: number
 *           description: Total number of pages available
 *           example: 5
 *         page:
 *           type: number
 *           description: Current page number
 *           example: 1
 *         limit:
 *           type: number
 *           description: Number of items per page
 *           example: 10
 *         totalData:
 *           type: number
 *           description: Total number of resources available
 *           example: 47
 */

/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Create a new resource with OCR content extraction
 *     description: Creates a new resource by downloading a PDF from the provided URL, extracting text content using OCR, and storing it in the database
 *     tags: [Resources]
 *     security:
 *       - Bearer: []
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

/**
 * @swagger
 * /api/resource:
 *   get:
 *     summary: Get paginated resources for the authenticated user
 *     description: Retrieves a paginated list of resources filtered by the authenticated user's ID
 *     tags: [Resources]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page (max 100)
 *         example: 10
 *     responses:
 *       200:
 *         description: Resources retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResourceResponse'
 *       400:
 *         description: Bad request - invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Page must be greater than 0"
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to fetch resources: Database error"
 */

// GET /api/resource - Get paginated resources for authenticated user
router.get("/", getUserFromToken, getResources);

// POST /api/resource - Create a new resource with OCR content extraction
router.post("/", getUserFromToken, createResource);

module.exports = router;
