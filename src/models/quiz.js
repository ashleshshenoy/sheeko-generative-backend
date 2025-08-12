const mongoose = require("mongoose");

const McqSchema = new mongoose.Schema(
	{
		question: {
			type: String,
			required: true,
			trim: true
		},
		options: {
			type: [String],
			required: true,
			validate: [arr => arr.length > 1, "At least two options required"]
		},
		answer: {
			type: String,
			required: true,
			trim: true
		}
	},
	{ _id: false }
);

const QuizSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true
		},
		resourceId: {
			type: String,
			required: true
		},
		mcqs: {
			type: [McqSchema],
			required: true,
			validate: [arr => arr.length > 0, "At least one MCQ required"]
		}
	},
	{
		timestamps: true
	}
);

const QuizModel = mongoose.model("Quiz", QuizSchema);

module.export = {
	QuizModel
};
