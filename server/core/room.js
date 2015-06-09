'use strict'

_ = require('underscore');
var Client = require('./client.js');
var SnapshotManager = require('../../shared/core/snapshot_manager');

function Room(socket) {
	this.entities = [];
	this.clients = [];
	this.snapshots = new SnapshotManager();

	this._socket = socket;
}

Room.prototype.init = function() {
	this._socket.on('connect', this.onConnection.bind(this));

    // start the game loop for this room with the configured tick rate
    setInterval(this.gameLoop.bind(this), 1000 / 60);
}

Room.prototype.onConnection = function(socket) {
	console.log("onconection");
	var client = new Client(socket);
	client.init();
	this.clients.push(client);
}

Room.prototype.onClientIncomingSync = function(transform) {
	
}

Room.prototype.gameLoop = function() {
	this.snapshots.add(this.entities);

	this.syncClients(this.entities.getLast(););
}

Room.prototype.syncClients = function() {
	// iterate over all clients blabla ///////////
	_.each(clients, function(client)) {
		client.syncGame(); //send snapshot here
	}
}


module.exports = Room;