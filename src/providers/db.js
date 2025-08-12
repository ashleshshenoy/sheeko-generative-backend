// returns a function to connect mongodb
const { Pool} = require("pg");
const mongoose = require("mongoose");

async function connectMongoDB() {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log("> mongodb connected");
	} catch (err) {
		console.error("Error connecting to MongoDB:", err);
		process.exit(1); 
	}
}


// todo: optimise the timeout 
const pool = new Pool({
	user: process.env.DB_USER, 
	host: process.env.DB_HOST,
	database: "postgres",
	password: process.env.DB_PASSWORD, 
	port: 5432, 
	ssl: { rejectUnauthorized: false }, 
});


module.exports = {
	pool,
	connectMongoDB
};
