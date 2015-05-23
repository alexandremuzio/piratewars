//helper
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
//


//trying to generalize game_server for multiple rooms!
//Problem: have to create a namespace for sockets, so that i only
//inform the players positions from the same room!
// Maybe? http://socket.io/docs/rooms-and-namespaces/
var game_server = function () {
	var MAX_ROOMS = 5;
	var ROOM_LIMIT = 5;

	var rooms = [];
	var players_map = {};

	createRooms(MAX_ROOMS);
}

game_server.createRooms = function(max) {
	for (var i = 0; i < max; i++) {
		rooms.push({});
	}
}


game_server.connectNewPlayer = function(guid) {

	for (var i = 0; i < rooms.length; i++) {
		if (rooms[i].size() < ROOM_LIMIT) {
			players_map[guid] = i;
			return true;
		}
	}
	return false;
}


game_server.updatePlayerFromRoom = function(roomNumber, guid,  data) {
	rooms[roomNumber][guid] = data;
}

game_server.disconnectPlayerFromRoom = function(roomNumber, guid) {
	delete rooms[roomNumber][guid];
}


game_server.serverUpdate = function(client) {
	for (var i = 0; i < rooms.length; i++) {

	}
}