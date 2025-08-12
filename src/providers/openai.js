const OpenAI = require("openai");
require("dotenv").config();
const { zodResponseFormat } =  require("openai/helpers/zod");


const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

async function OpenAiCompletion({ query, prompt, previousMessages = [], stream = false, ResponseSchema}) {

	const model = "gpt-4o-mini";
	
	const requestBody = {
		model,
		messages: [
			{ role: "system", content: prompt },
			...previousMessages,
			{ role: "user", content: query },
		],
		stream,
		temperature: 0.3, 
		response_format: zodResponseFormat(ResponseSchema, "summary"),
		max_tokens: 15000, 
	};

	const completion = await openai.beta.chat.completions.parse(requestBody);

	const response = completion.choices[0].message;
	
	if (!response) {
		throw new Error("No response received from API");
	}

	// console.log("Response:", response);
	if (stream) {
		return response.body;
	} else if (response.parsed) {
		return response.parsed;
	} else {
		// console.log("Response Data:", response);
		return null;
	}
}

module.exports = {
	OpenAiCompletion
};