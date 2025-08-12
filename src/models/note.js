const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	resourceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Resource",
		required: true
	},
	modules: [{
		title: {
			type: String,
			required: true
		},
		overview: {
			type: String,
			required: true
		},
		submodules: [{
			subtitle: {
				type: String,
				required: true
			},
			points: [{
				type: String,
				required: true
			}],
			imageUrls: [{
				type: String
			}]
		}]
	}]
}, {
	timestamps: true
});

module.exports = mongoose.model("Note", noteSchema);
