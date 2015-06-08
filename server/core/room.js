'use strict'

var Client = require('./client.js');
_ = require('underscore');

function Room(socket) {
	this.entities = [];
	this.clients = [];

	this._socket = socket;
}

Room.prototype.init = function() {
	this._socket.on('connect', this.onConnection.bind(this));

    // start the game loop for this room with the configured tick rate
    setInterval(this.gameLoop.bind(this), 1000 / 60);
}

Room.prototype.onConnection = function(socket) {
	console.log("onconecction");
	var client = new Client(socket);
	client.init();
	this.clients.push(client);
}

Room.prototype.onClientIncomingSync = function(transform) {
	
}

Room.prototype.gameLoop = function() {
	this.syncClients();
}

Room.prototype.syncClients = function() {
	// iterate over all clients blabla ///////////
}


module.exports = Room;