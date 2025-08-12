const { fromPath } = require("pdf2pic");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

async function getPageCount(pdfPath) {
	const data = await fs.promises.readFile(pdfPath);
	const pdfDoc = await PDFDocument.load(data);
	return pdfDoc.getPageCount();
}

async function extractTextPerPage(pdfPath, lang = "eng", dpi = 300) {
	const convert = fromPath(pdfPath, {
		density: dpi,
		saveFilename: "temp_page",
		savePath: "./temp_images",
		format: "png",
		width: 1654,
		height: 2339
	});

	if (!fs.existsSync("./temp_images")) {
		fs.mkdirSync("./temp_images");
	}

	const totalPages = await getPageCount(pdfPath);

	const ocrPromises = Array.from({ length: totalPages }, (_, idx) => {
		const pageNum = idx + 1;
		return convert(pageNum)
			.then(pageImage =>
				Tesseract.recognize(pageImage.path, lang, {
					langPath: "https://tessdata.projectnaptha.com/4.0.0"
				})
			)
			.then(({ data: { text } }) => {
				console.log(`[INFO] Processed page ${pageNum}/${totalPages}`);
				return { pageNum, text };
			});
	});

	const results = await Promise.all(ocrPromises);

	// Sort just in case, then return only the text in page order
	return results
		.sort((a, b) => a.pageNum - b.pageNum)
		.map(r => r.text);
}


module.exports = {
	extractTextPerPage 
};
