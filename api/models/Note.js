var Workshop = require("./Workshop");
var Group = require("./Group");

module.exports = {
	attributes: {
		workshop: {type: Workshop},
		note: {type: String},
		target: {type: Group}
	}
};