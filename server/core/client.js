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

	// TESTS
	this._player.transform.position.x = 100;
	this._player.transform.position.y = 300;

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

	////////////////////// Provisory:
	//delete(_snapshot.players[this._player.id]);
	/////////////////////////////////
	// var newPlayersList = _.filter(snapshot.players, function(player) {return player.id != this._player.id; }.bind(this))
	// var newSnapshot = {players : newPlayersList};

	// console.log(snapshot);
	// _.each(snapshot.players, function(entity) {
	// 	console.log(entity);
	// });
	// console.log("sending snapshot", snapshot);
	this._socket.emit('game.sync', snapshot);
}

module.exports = Client;