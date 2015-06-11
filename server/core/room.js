'use strict'

var _ = require('underscore');
var Client = require('./client.js');
var SnapshotManager = require('../../shared/core/snapshot_manager');

function Room(socket) {
	this.entities = [];
	this.clients = [];
	this.snapshots = new SnapshotManager();

	this._socket = socket;
}

Room.prototype.init = function() {
	this._socket.sockets.on('connect', this.onConnection.bind(this));

    // start the game loop for this room with the configured tick rate
    setInterval(this.gameLoop.bind(this), 1000/60);
}

Room.prototype.onConnection = function(socket) {
	console.log("onconection");
	var client = new Client(socket, this);
	client.init();
}

Room.prototype.onClientIncomingSync = function(transform) {
	
}

Room.prototype.gameLoop = function() {


	this.snapshots.add(this.entities);
	var clientSnapshot = {};
	clientSnapshot.players = {};

	_.each(this.entities, function(entity) {
		clientSnapshot.players[entity.id] = entity.transform;
	});

	// console.log(clientSnapshot);
	this.syncClients(clientSnapshot);
}

Room.prototype.syncClients = function(snapshot) {
	var i = 0;
	_.each(this.clients, function(client) {
			// console.log("syncing client", client._id, "snapshot=");
			// console.log(snapshot);
			client.syncGame(snapshot); //send snapshot here
	});
}

module.exports = Room;