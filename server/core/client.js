'use strict';

var _ = require('underscore');
var UUID = require('node-uuid');
var PlayerFactory = require('./player_factory.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');
// var GameEngine = require('../../shared/game_engine.js');

function Client(socket, room) {
	// console.log('inside client constr');
	this._id = UUID();
	this.name = null;
	this.chosenTeam = null;
	this.ready = false;
	this._room = room;
	this._socket = socket;
	this.player = null;
	this._disconnectListener = this.onDisconnect.bind(this);
	this._syncListener = this.queueSyncFromClient.bind(this);
	this._nameListener = this.onName.bind(this);
	this._teamListener = this.onChangeTeam.bind(this);
	this._readyListener = this.onReady.bind(this);
	this._eventList = ['client.name',
		'client.changeTeam',
		'client.ready',
		'client.sync'];
	this._snapshots = new SnapshotManager();
	//DEBUG
	this._packagesLost = 0;
	this._lastStep = -1;
}

Client.prototype.init = function () {
	this._socket.emit('onconnected');
	this._socket.on('disconnect', this._disconnectListener);
	this._socket.on('client.name', this._nameListener);
	this._socket.on('client.changeTeam', this._teamListener);
	this._socket.on('client.ready', this._readyListener);
	// process.on('SIGINT', function(){
	//    	console.log(this._packagesLost + ' from ' + this._lastStep + ' lost (' + 100*this._packagesLost/this._lastStep + '%)');
	// }.bind(this));
};

/*******************************************************/
/****************** NETWORK CALLBACKS ******************/
/*******************************************************/
Client.prototype.onDisconnect = function () {
	this._room.removeClient(this);
};

Client.prototype.onName = function (name) {
	if (_.isString(name)) {
		this.name = name;
		this.initialize();
	}
	else {
		console.error('Didnt get a string as name from the client');
	}
};

// Improve this
Client.prototype.initialize = function () {
	this.chosenTeam = this._room.getWeakestChosenTeam();
	this._room.clients.push(this);
};

Client.prototype.onChangeTeam = function (team) {
	if (this._room.validateTeam(team)) {
		this.chosenTeam = team;
	}
	else {
		console.error('Invalid chosen team');
	}
};

Client.prototype.onReady = function (ready) {
	if (_.isBoolean(ready)) {
		this.ready = ready;
	}
	else {
		console.error('Invalid ready state');
	}
};


/******************************************************/
/****************** HELPER FUNCTIONS ******************/
/******************************************************/
Client.prototype.createPlayer = function () {
	var team = this._room.gameManager.teams.get(this.chosenTeam);
	this.player = PlayerFactory.createPlayer(this._socket, this._snapshots, team);
	this._socket.emit('player.create',
		{
			id: this.player.id,
			name: this.name,
			transform: this.player.transform.getPosition(),
			initialAttrs: this.player.initialAttrs.getAll()
		});
};

Client.prototype.queueSyncFromClient = function (message) {
	// Debug package loss
	if (message.step !== this._lastStep + 1) {
		this._packagesLost += (this._lastStep + 1) - message.step;
	}
	this._lastStep = message.step;

	this._snapshots.add(message);
};

Client.prototype.startListeningToUpdates = function () {
	this._socket.on('client.sync', this._syncListener);
};

Client.prototype.clearClientListeners = function () {
	_.each(this._eventList, function (event) {
		// this._socket.removeAllListeners(event); ///////////////
	}, this);
};


/****************************************************/
/****************** SYNC FUNCTIONS ******************/
/****************************************************/
Client.prototype.sendInitialMatchInfo = function (info) {
	this._socket.emit('game.initialInfo', info);
};

Client.prototype.sendChangedState = function (newState) {
	this._socket.emit('game.state', newState);
};

Client.prototype.sendGameSync = function (snapshot) {
	this._socket.emit('game.sync', snapshot);
};

Client.prototype.sendMatchResults = function (results) {
	this._socket.emit('game.results', results);
};

Client.prototype.sendLobbyInfo = function (info) {
	info.selfTeam = this.chosenTeam;
	this._socket.emit('lobby.info', info);
};

module.exports = Client;