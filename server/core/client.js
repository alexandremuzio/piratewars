'use strict'

var _ = require('underscore');
var UUID = require('node-uuid');
var PlayerFactory = require('./player_factory.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');
var GameEngine = require('../../shared/game_engine.js');

function Client(socket, room) {
	// console.log("inside client constr");
	this._id =  UUID();
	this._room = room;
	this._socket = socket;
	this._player = null;
	this._snapshots = new SnapshotManager();
	//DEBUG
	this._packagesLost = 0;
	this._lastStep = -1;
}

Client.prototype.init = function() {
	// console.log("client init");
	this._socket.emit('onconnected');
	this._socket.on('player.ready', this.onReady.bind(this));
	// process.on("SIGINT", function(){
 //    	console.log(this._packagesLost + " from " + this._lastStep + " lost (" + 100*this._packagesLost/this._lastStep + "%)");
	// }.bind(this));
}

Client.prototype.onReady = function() {
	// console.log("client onReady");
	this._player = this.createPlayer();
	console.log("after createPlayer");
	this._socket.on('client.sync', this.queueSyncFromClient.bind(this));
	this._room.clients.push(this);
}

Client.prototype.createPlayer = function() {
	// console.log("client createPlayer");
	var entity = PlayerFactory.createPlayer(this._socket, this._snapshots);
	this._socket.emit('player.create', 
		{
			id: entity.id,
			transform: entity.transform.getPosition(),
			initialAttrs: entity.initialAttrs.getAll()
		});
	return entity;
}

Client.prototype.queueSyncFromClient = function(message) {
	if (message.step !== this._lastStep + 1) {
		this._packagesLost += (this._lastStep + 1) - message.step; 
	}
	this._lastStep = message.step;
	this._snapshots.add(message);
}

Client.prototype.sendGameSync = function(snapshot) {
	this._socket.emit('game.sync', snapshot);
}

Client.prototype.sendChangedState = function(newState) {
	this._socket.emit('game.state', newState);
}

module.exports = Client;