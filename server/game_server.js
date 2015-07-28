'use strict';

var Room = require('./core/room.js');

function GameServer(socket) {
	this.rooms = [];
	this._socket = socket;
}

GameServer.prototype.init = function () {
	var room = new Room(this._socket);
	this.rooms.push(room);
	room.init();
};

module.exports = GameServer;