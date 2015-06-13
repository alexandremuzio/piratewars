'use strict'

var _ = require('underscore');
var Client = require('./client.js');
var SnapshotManager = require('../../shared/core/snapshot_manager');
var GameEngine = require('../../shared/game_engine.js');

function Room(socket) {
	this.clients = [];
	this.snapshots = new SnapshotManager();
	this._socket = socket;
}

Room.prototype.init = function() {
	this._socket.sockets.on('connect', this.onConnection.bind(this));
    setInterval(this.gameLoop.bind(this), 1000/60);
}

Room.prototype.onConnection = function(socket) {
	console.log("onconection");
	var client = new Client(socket, this);
	client.init();
}

Room.prototype.onClientIncomingSync = function(transform) {}

Room.prototype.gameLoop = function() {
	// console.log("");
    // console.log("STARTING applySyncFromClient");
	// this.applySyncFromClients(); // Now done inside input component
    // console.log("ENDING applySyncFromclient");

    // console.log("STARTING gameStep");
    GameEngine.getInstance().gameStep();
    // console.log("ENDING gameStep");

    // console.log("STARTING emit");
	this.sendSyncToClients();
	// console.log("ENDING emit");
	// console.log("");
}

// Room.prototype.applySyncFromClients = function() {
// 	_.each(this.clients, function(client) {
// 		client.applySyncFromClient();
// 	});
// }

Room.prototype.sendSyncToClients = function() {
	var clientSnapshot = {};
	clientSnapshot.players = {};
	_.each(GameEngine.getInstance().entities, function(entity) {
		clientSnapshot.players[entity.id] = entity.components.get('physics').getTransform();
	});
	this.syncClients(clientSnapshot);
}

Room.prototype.syncClients = function(snapshot) {
	_.each(this.clients, function(client) {
			client.syncGame(snapshot);
	});
}

module.exports = Room;