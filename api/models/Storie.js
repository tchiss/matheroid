var User = require("./User");
var StorieTarget = require("./StorieTarget");

module.exports = {
	attributes: {
		from: {type: User},
		verbe: {type: String},
		target: {type: StorieTarget}
	},
};