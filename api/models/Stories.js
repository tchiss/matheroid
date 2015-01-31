/**
* Stories.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var StoriesTarget = require('./StorieTarget');
var User = require('./User');

module.exports = {

  attributes: {
  	from: User,
  	verb: String,
  	target: StoriesTarget
  }
};

