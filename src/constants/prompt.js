const { z } = require("zod");

const multipleChoiceQuizSchema = z.object({
	multipleChoiceQuiz: z.array(
		z.object({
			question: z.string().trim().min(1, "Question is required"),
			options: z.array(z.string()).min(2, "At least two options required"),
			answer: z.string().trim().min(1, "Answer is required")
		})
	).min(1, "At least one MCQ required")
});


const notesSchema = z.object({
	modules: z.array(
		z.object({
			title: z.string().min(1, "Title is required"),
			overview: z.string().min(1, "Overview is required"),
			submodules: z.array(
				z.object({
					subtitle: z.string().min(1, "Subtitle is required"),
					points: z.array(z.string().min(1, "Point is required")),
					imageUrls: z.array(z.string().url("Must be a valid URL")).optional()
				})
			)
		})
	)
});

module.exports = {
	notesSchema,
	multipleChoiceQuizSchema
};