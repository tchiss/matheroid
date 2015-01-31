/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  //schema: true,
  attributes: {
    name: { type: 'string', required: true },
    username: { type: 'string', required: true },
    email: { type: 'string', lowercase: true, email: true, required: true, unique: true },
    role: { type: 'string', default: 'user' },
    hashedPassword: { type: 'string'},
    provider: 'string',
    salt: 'string',
    facebook: {},
    twitter: {},
    google: {},
    github: {},

    toJSON: function(){ var user = this.toObject(); delete user.password; delete user.hashedPassword; delete user.confirmation; delete user._csrf; return user;}
  },

  beforCreate: function(values, next){
    if(!values.password || values.password != values.confirmation) {
      return next({err: ['Password doesn\' match password confirmation']});
    }

    required('bcrypt').hash(values.password, 10, function passwordHashed(err, hashedPassword) {
      if (err) return next(err);
      values.hashedPassword = hashedPassword;
      //values.online = true;
      next();
    });
  }
};

