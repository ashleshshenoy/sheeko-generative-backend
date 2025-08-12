const { ResourceModel } = require("../../models/resource");
const { HttpError } = require("../../utils/http");

/**
 * @desc Get paginated resources filtered by userId
 */
const getResources = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		
		// Validate pagination parameters
		if (page < 1) {
			return next(new HttpError("Page must be greater than 0", 400));
		}
		
		if (limit < 1 || limit > 100) {
			return next(new HttpError("Limit must be between 1 and 100", 400));
		}

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// Build query filter
		const filter = { userId };

		// Get total count for pagination
		const totalData = await ResourceModel.countDocuments(filter);

		// Calculate total pages
		const totalPages = Math.ceil(totalData / limit);

		// Get paginated resources
		const resources = await ResourceModel.find(filter)
			.select("-__v")
			.sort({ createdAt: -1 }) // Sort by newest first
			.skip(skip)
			.limit(limit);

		// Format response
		const data = resources.map(resource => ({
			id: resource._id,
			title: resource.title,
			fileUrl: resource.fileUrl,
			userId: resource.userId,
			content: {
				totalPages: resource.content.totalPages,
				extractedAt: resource.content.extractedAt
			},
			createdAt: resource.createdAt,
			updatedAt: resource.updatedAt
		}));

		res.status(200).json({
			success: true,
			data,
			totalPages,
			page,
			limit,
			totalData
		});

	} catch (error) {
		return next(new HttpError(`Failed to fetch resources: ${error.message}`, 500));
	}
};

module.exports = {
	getResources
};
