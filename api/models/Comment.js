/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var User = require('./User');

module.exports = {

  attributes: {
  	author: User,
  	message: String,
  	date: Date,
  	commentable_id: Number,
  	commentable_type: String,
  }
};

