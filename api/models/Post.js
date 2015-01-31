/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var User = require('./User');

module.exports = {

  attributes: {
  	title: String,
  	content: String,
  	author: User
  }
};

