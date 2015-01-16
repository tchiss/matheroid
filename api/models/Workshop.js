var Subject = require("./Subject");

module.exports = {
	attributes: {
		topic: {type: String},
		content: {type: String},
		subject: {type: Subject}
	},
};