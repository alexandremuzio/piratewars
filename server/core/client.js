'use strict'

var UUID = require('node-uuid');
var EntityFactory = require('./entity_factory.js');
var _ = require('underscore');

function Client(socket, room) {
	console.log("inside client constr");
	this._id =  UUID();
	this._room = room;
	this._socket = socket;
	this._player = null;
}

Client.prototype.init = function() {
	console.log("client init");
	this._socket.emit('onconnected');
	this._socket.on('player.ready', this.onReady.bind(this));
}

Client.prototype.onReady = function() {
	console.log("client onReady");
	this._player = this.createPlayer();
	this._socket.on('sync', this.applySyncFromClient.bind(this));
	this._room.clients.push(this);
}

Client.prototype.createPlayer = function() {
	console.log("client createPlayer");
	var entity = EntityFactory.createPlayer(this._socket);
	this._room.entities.push(entity);
	this._socket.emit('player.create', { id: entity.id });
	console.log('inside createPlayer');
	return entity;
}

Client.prototype.applySyncFromClient = function(transform) {
	// console.log("applySyncFromClient", this._id, "position=");
	// console.log(transform.position);
	// console.log(transform);
	this._player.transform = transform;
}

Client.prototype.syncGame = function(snapshot) {
	this._socket.emit('game.sync', snapshot);
}

module.exports = Client;