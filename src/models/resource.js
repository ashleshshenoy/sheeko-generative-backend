const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
		fileUrl: {
			type: String,
			required: true,
			trim: true
		},
		userId: {
			type: String,
			required: true
		},
		content: {
			type: Object,
			default: {}
		}
	},
	{
		timestamps: true
	}
);

const ResourceModel = mongoose.model("Resource", ResourceSchema);

module.exports = {
    ResourceModel
}
