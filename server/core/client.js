'use strict'

var _ = require('underscore');
var UUID = require('node-uuid');
var EntityFactory = require('./entity_factory.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');
var GameEngine = require('../../shared/game_engine.js');

function Client(socket, room) {
	console.log("inside client constr");
	this._id =  UUID();
	this._room = room;
	this._socket = socket;
	this._player = null;
	this._snapshots = new SnapshotManager();
}

Client.prototype.init = function() {
	console.log("client init");
	this._socket.emit('onconnected');
	this._socket.on('player.ready', this.onReady.bind(this));
}

Client.prototype.onReady = function() {
	console.log("client onReady");
	this._player = this.createPlayer();
	this._socket.on('client.sync', this.queueSyncFromClient.bind(this));
	this._room.clients.push(this);
}

Client.prototype.createPlayer = function() {
	console.log("client createPlayer");
	var data = {};
	data.socket = this._socket;
	data.snapshots = this._snapshots;
	var entity = EntityFactory.createPlayer(data);
	GameEngine.getInstance().addEntity(entity);
	this._socket.emit('player.create', { id: entity.id });
	return entity;
}

Client.prototype.queueSyncFromClient = function(transform) {
	this._snapshots.add(transform);
}

Client.prototype.syncGame = function(snapshot) {
	// console.log("sending snapshot with pos x= ", snapshot.players[this._player.id].position.x);
	// console.log("x3= ", this._player.components.get('physics').getTransform().position.x);
	this._socket.emit('game.sync', snapshot);
}

module.exports = Client;