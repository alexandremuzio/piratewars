'use strict'

var UUID = require('node-uuid');
var EntityFactory = require('entity_factory.js');

function Client(socket, room) {
	this._id =  UUID();

	this._room = room;
	this._socket = socket;
	this._player = null;
}

Client.prototype.init = function() {
	this._socket.emit('onconnected', {id: this._id});
	onReady(); ///////////////////////////
}

Client.prototype.onReady = function() {
	this._socket.on('sync', this.applySyncFromClient().bind(this));
	this._player = this.createPlayer();
}

Client.prototype.createPlayer = function() {
	var entity = EntityFactory.createPlayer(_socket);
	this._room.push(this._player);

	this._socket.emit('player.create', entity);
	return entity;
}

Client.prototype.applySyncFromClient = function(transform) {
	this._player.transform = transform;
}

Client.prototype.syncGame = function(snapshot) {
	this._socket.emit('sync.game', snapshot);
}

module.exports = Client;