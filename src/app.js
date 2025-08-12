const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Import providers and routes
const { swaggerDocs } = require("./providers/swagger");
const { connectMongoDB } = require("./providers/db");
const storageRoutes = require("./routes/storage");
const resourceRoutes = require("./routes/resource");

const app = express();
const PORT = process.env.PORT || 443;

// Get Swagger specification
const swaggerSpec = swaggerDocs;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/storage", storageRoutes);
app.use("/api/resource", resourceRoutes);

// Root endpoint
app.get("/", (req, res) => {
	res.json({
		message: "Health check OK",
		
	});
});

// 404 handler
app.use("*", (req, res) => {
	res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res) => {
	console.error(err.stack);
	
	if (err.status) {
		return res.status(err.status).json({ error: err.message });
	}
	
	res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, async () => {
	try {
		// Connect to MongoDB
		await connectMongoDB();
		console.log("🔍 Health check available at http://localhost:" + PORT + "/health");
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
});

module.exports = app;
