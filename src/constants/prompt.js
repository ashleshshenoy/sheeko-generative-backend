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

module.exports = {
	multipleChoiceQuizSchema
};