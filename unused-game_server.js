'use strict';

//helper
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
//


//trying to generalize gameServer for multiple rooms!
//Problem: have to create a namespace for sockets, so that i only
//inform the players positions from the same room!
// Maybe? http://socket.io/docs/rooms-and-namespaces/
var gameServer = function () {
	var MAX_ROOMS = 5;
	var ROOM_LIMIT = 5;

	var rooms = [];
	var players_map = {};

	createRooms(MAX_ROOMS);
}

gameServer.createRooms = function(max) {
	for (var i = 0; i < max; i++) {
		rooms.push({});
	}
}


gameServer.connectNewPlayer = function(guid) {

	for (var i = 0; i < rooms.length; i++) {
		if (rooms[i].size() < ROOM_LIMIT) {
			players_map[guid] = i;
			return true;
		}
	}
	return false;
}


gameServer.updatePlayerFromRoom = function(roomNumber, guid,  data) {
	rooms[roomNumber][guid] = data;
}

gameServer.disconnectPlayerFromRoom = function(roomNumber, guid) {
	delete rooms[roomNumber][guid];
}


gameServer.serverUpdate = function(client) {
	for (var i = 0; i < rooms.length; i++) {

	}
}