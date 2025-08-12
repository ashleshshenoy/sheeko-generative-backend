const NODE_ENV = process.env.NODE_ENV || "dev";


const SUBBUCKET_PATH = Object.freeze({
	RESOURCE:`${NODE_ENV}/resource`,
});


module.exports = {
	SUBBUCKET_PATH
};
