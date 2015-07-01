'use strict'

var _ = require('underscore');
var Client = require('./client.js');
var SnapshotManager = require('../../shared/core/snapshot_manager');
var GameEngine = require('../../shared/game_engine.js');
var PlayerFactory = require('./player_factory.js');
var TeamManager = require('./team_manager.js');
var Team = require('./team');

var game_config = require('../../shared/settings/game_config.json');
var team_settings = require('../../shared/settings/teams.json');

function Room(socket) {

	this.teams = new TeamManager();
	this.playerCount = 0;

	this.clients = [];
	this.snapshots = new SnapshotManager();
	this._socket = socket;
	this._gameState = null;
	this._startTime = null;
	this._preGameDuration = 1000;
	this._endGameDuration = 500;
}

Room.prototype.init = function() {
	PlayerFactory.init(this);

	this._socket.sockets.on('connect', this.onConnection.bind(this));
	this.createInitialEntities();
	this.createTeams();
	this._gameState = this.preGameStateLoop;
	this.preGameStateInit();
	this._gameLoopInterval = setInterval(this.gameLoop.bind(this), game_config.game_tick_rate);
}

Room.prototype.createInitialEntities = function() {
	this._stronghold0 = PlayerFactory.createStronghold(0);
	this._stronghold1 = PlayerFactory.createStronghold(1);
}

Room.prototype.createTeams = function() {
	_.each(team_settings.teams, function(teamSetting) {
		var newTeam = new Team(teamSetting, this);
		this.teams.add(teamSetting.name, newTeam);
	}, this);
}

Room.prototype.onConnection = function(socket) {
	// console.log("onconection");
	var client = new Client(socket, this);
	client.init();
}

Room.prototype.gameLoop = function() {
	this._gameState();
}

Room.prototype.preGameStateInit = function() {   
	this.sendChangedStateToClients('preGame');
	console.log("Changed state to preGame!");
	this._startTime = new Date();
}
Room.prototype.preGameStateLoop = function() {
	var currentTime = new Date();
	if (currentTime - this._startTime > this._preGameDuration) {
		this._gameState = this.playingStateLoop;
		this.playingStateInit();
	}
}

Room.prototype.playingStateInit = function() {
	this.sendChangedStateToClients('playing');
    this._sendSyncInterval = setInterval(this.sendSyncToClients.bind(this), game_config.network_tick_rate);
	console.log("Changed state to playing!");
	this._startTime = new Date();
}
Room.prototype.playingStateLoop = function() {
	var currentTime = new Date();
	if (this._stronghold0.components.get('health').currentHealth <= 0 ||
			this._stronghold1.components.get('health').currentHealth <= 0) {
		this._gameState = this.endGameStateLoop;
		clearInterval(this._sendSyncInterval);
		this.endGameStateInit();
	}
	GameEngine.getInstance().gameStep();
}

Room.prototype.endGameStateInit = function() {
	this.sendChangedStateToClients('endGame');
	console.log("Changed state to endGame!");
	this._startTime = new Date();
}
Room.prototype.endGameStateLoop = function() {
	var currentTime = new Date();
	if (currentTime - this._startTime > this._endGameDuration) {
		this._gameState = this.preGameStateLoop;
		this.preGameStateInit();
	}
}

Room.prototype.sendSyncToClients = function() {
	var clientSnapshot = {};
	clientSnapshot.players = {};
	clientSnapshot.bullets = {};
	clientSnapshot.strongholds = {};
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
		else if (entity.key === 'stronghold') {
			clientSnapshot.strongholds[entity.id] = {};
			clientSnapshot.strongholds[entity.id].health = entity.components.get('health').currentHealth;
		}
	});
	this.sendGameSyncToClients(clientSnapshot);
}

Room.prototype.sendGameSyncToClients = function(snapshot) {
	_.each(this.clients, function(client) {
			client.sendGameSync(snapshot);
	});
}

Room.prototype.sendChangedStateToClients = function(newState) {
	_.each(this.clients, function(client) {
			client.sendChangedState(newState);
	});
}

module.exports = Room;