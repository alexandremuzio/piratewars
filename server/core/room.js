'use strict'

var _ = require('underscore');
var Client = require('./client.js');
var SnapshotManager = require('../../shared/core/snapshot_manager');
var GameEngine = require('../../shared/game_engine.js');
var PlayerFactory = require('./player_factory.js');

function Room(socket) {
	this.clients = [];
	this.snapshots = new SnapshotManager();
	this._socket = socket;
}

Room.prototype.init = function() {
	this._socket.sockets.on('connect', this.onConnection.bind(this));
	this.createInitialEntities();
    setInterval(this.gameLoop.bind(this), 1000/60);
    setInterval(this.sendSyncToClients.bind(this), 1000/20);
}

Room.prototype.createInitialEntities = function() {
	PlayerFactory.createStronghold(0);
	PlayerFactory.createStronghold(1);
}

Room.prototype.onConnection = function(socket) {
	// console.log("onconection");
	var client = new Client(socket, this);
	client.init();
}

Room.prototype.gameLoop = function() {
	// console.log("");
    // console.log("STARTING applySyncFromClient");
	// this.applySyncFromClients(); // Now done inside input component
    // console.log("ENDING applySyncFromclient");

    // console.log("STARTING gameStep");
    GameEngine.getInstance().gameStep();
    // console.log("ENDING gameStep");

    // console.log("STARTING emit");
	//this.sendSyncToClients(); // Now done inside a setInterval function
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
	clientSnapshot.bullets = {};
	_.each(GameEngine.getInstance().entities, function(entity) {
		if (entity.key === 'player') {
			clientSnapshot.players[entity.id] = {};
			clientSnapshot.players[entity.id].transform = entity.transform.getTransform();
			clientSnapshot.players[entity.id].health = entity.components.get('health').currentHealth;
		}
		else if (entity.key === 'bullet' && entity.components.get('bullet').sent === false) {
			entity.components.get('bullet').sent = true;
			clientSnapshot.bullets[entity.id] = entity.transform.getTransform();
		}
	});
	this.syncClients(clientSnapshot);
}

Room.prototype.syncClients = function(snapshot) {
	_.each(this.clients, function(client) {
			client.syncGame(snapshot);
	});
}

module.exports = Room;