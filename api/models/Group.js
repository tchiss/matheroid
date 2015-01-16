var User = require("./User");
var Workshop = require("./Workshop");

module.exports = {
	attributes: {
		user: {type: User},
		workshops: {type: Workshop},
		name: {type: String}
	}
};