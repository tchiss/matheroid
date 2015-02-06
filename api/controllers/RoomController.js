/**
 * RoomController
 *
 * @description :: Server-side logic for managing Rooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 var _ = require('underscore');
 var Room = require('../models/Room');

module.exports = {
	'join': function(req, res, next){ // Joindre la room
		var roomId = req.param('roomId');
		Room.findOne({id: roomId}).populate('users').exec(function(err, room){
			var currentUserIsInRoom = _.find(room.users, function(user){ return user.id==req.user.id; });
			if (currentUserIsInRoom == null)
				Room.subscribe(req, roomId, ['message']);
		});
		return next();
	},

	'leave': function(req, res, next){ // Quitter la roomId
		var roomId = req.param('roomId');
		Room.unsubscribe(req, roomId, ['message']);

		return next();
	}
};

