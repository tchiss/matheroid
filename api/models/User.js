/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt'),
    uuid = require("node-uuid"),
    _ = require("lodash");

module.exports = {
  //schema: true,
  attributes: {
    name: { type: 'string', required: true },
    username: { type: 'string', required: true },
    email: { type: 'string', lowercase: true, email: true, required: true, unique: true },
    role: { type: 'string', default: 'user' },
    hashedPassword: { type: 'string'},
    sessionTokens: {type: 'array'},
    passwordResetToken: {type: 'json'},
    provider: 'string',
    salt: 'string',
    facebook: {},
    twitter: {},
    google: {},
    github: {},

    toJSON: function(){
      var user = this.toObject();

      delete user.password;
      delete user.confirmation;
      delete user.hashedPassword;
      delete user._csrf;
      return user;
    }
  },

  //Check if the supplied password matches the stored password.
     
  validatePassword: function( candidatePassword, cb ) {
    bcrypt.compare( candidatePassword, this.hashedPassword, function (err, valid) {
      if(err) return cb(err);
        cb(null, valid);
    });
  },

  //Generate password reset token
     
  generatePasswordResetToken: function(cb) {
    this.passwordResetToken = Token.generate();
    this.save(function (err) {
      if(err) return cb(err);
        cb();
    });
  },

  /**
   * Send password reset email
   *
   * Generate a password reset token and send an email to the user with
   * instructions to reset their password
   */

  /*sendPasswordResetEmail: function(cb) {
      var self = this;

      this.generatePasswordResetToken(function (err) {
        if(err) return cb(err);

        // Send email
        var email = new Email._model({
          to: {
            name: self.fullName(),
            email: self.email
          },
          subject: "Reset your Sliptree password",
          data: {
            resetURL: sails.config.localAppURL + '/reset-password/#/' + self.id + '/' +self.passwordResetToken.value
          },
          tags: ['password-reset','transactional'],
          template: 'password-reset'
        });

        email.setDefaults();

        email.send(function (err, res, msg) {
          cb(err, res, msg, self.passwordResetToken);
        });
      });
    },*/
  //},

  beforeCreate: [
    // Encrypt user's password
    function (values, cb) {
      if (!values.password || values.password !== values.passwordConfirmation) {
        return cb({ err: "Password doesn\'t match confirmation!" });
      }

      User.encryptPassword(values, function (err) {
        cb(err);
      });
    },

    // Create an API key
    function (values, cb) {
      values.apiKey = uuid.v4();
      cb();
    }
  ],

  /**
   * Functions that run before a user is updated
   */
   
  beforeUpdate: [
    // Encrypt user's password, if changed
    function (values, cb) {
      if (!values.password) {
        return cb();
      }

      User.encryptPassword(values, function (err) {
        cb(err);
      });
    }
  ],

  /**
   * User password encryption. Uses bcrypt.
   */

  encryptPassword: function(values, cb) {
    bcrypt.hash(values.password, 10, function (err, hashedPassword) {
      if(err) return cb(err);
      values.hashedPassword = hashedPassword;
      cb();
    });
  },

  /**
   * Issue a session token for a user
   */

  issueSessionToken: function(user, cb) {
    if (!user || typeof user === 'function') return cb("A user model must be supplied");

    if (!user.sessionTokens) {
      user.sessionTokens = [];
    }

    var token = uuid.v4();

    user.sessionTokens.push({
      token: token,
      issuedAt: new Date()
    });

    user.save(function (err) {
      cb(err, token);
    });
  },

  /**
   * Consume a user's session token
   */  

  consumeSessionToken: function (token, cb) {
    if (!token || typeof token === 'function') return cb("A token must be supplied");

    User.findOne({'sessionTokens.token': token }, function (err, user) {
      if (err) return cb( err );
      if (!user) return cb(null, false);

      // Remove the consumed session token so it can no longer be used
      if (user.sessionTokens) {
        user.sessionTokens.forEach(function (sessionToken, index) {
          if (sessionToken.token === token) {
            delete user.sessionTokens[index];
          }
        });
      }

      // Remove falsy tokens
      user.sessionTokens = _.compact(user.sessionTokens);

      // Save
      user.save(function (err) {
        return cb( err, user );
      });
    });
  }
};

