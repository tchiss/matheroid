/**
 * LoginController
 *
 * @description :: Server-side logic for managing Logins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');

module.exports = {
	'index': function(req, res){
		/*var oldDateObj = new Date();
		var newDateObj = new Date(oldDateObj.getTime() + 60000);
		req.session.cookie.expires = newDateObj;
		req.session.authenticated = true;
		console.log(req.session);*/
		res.view('user/login');
	},

	'login': function(req, res, next){
		if (!req.param('email') || !req.param('password')) {
			var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'Username and password required'}]

			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect('/user/login');
			return;
		}

		User.findOneByEmail(req.body.email).done(function(err, user) {
			if (err) return next(err);

			if (!user){
				var noAccountError = [{name: 'noAccount', message: 'This email: ' + req.param('email') + 'doesn\'t exist'}]
				req.session.flash = {
					err: noAccountError
				}
				res.redirect('/user/login');
				return;
			}

			bcrypt.compare(req.param('password'), user.hashedPassword, function(err, valid){
				if (err) return next(err);

				if(!valid) {
					var usernamePasswordMissmatchError = [{name: 'usernamePasswordMissmatch', message: 'Invalid username and password combination'}]

					req.session.flash = {
					err: usernamePasswordMissmatchError
				}
				res.redirect('/user/login');
				return;
			}

			req.session.authenticated = true;
			req.session.User = user;

			res.redirect('/user/me/' + user.id);
			});
		});
	},

	'destroy': function(req, res){
		req.session.destroy();
		res.redirect('/login');
	}
	/*'logout': function(req, res){
		req.logout();
		res.redirect('/');
	}*/
};

