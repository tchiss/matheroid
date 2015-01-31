/**
* Group.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Workshop = require('./Workshop');
var User = require('./User');

module.exports = {

  attributes: {
  	users: User,
  	workshop: Workshop,
  	name: String
  }
};

