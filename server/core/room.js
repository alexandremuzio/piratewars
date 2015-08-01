'use strict';

var _ = require('underscore');
var Client = require('./client.js');
var GameEngine = require('../../shared/game_engine.js');
var GameManager = require('./game_manager.js');
var GameStatesEnum = require('../utils/game_states_enum');
var LobbyManager = require('./lobby_manager.js');
var LobbyStatesEnum = require('../utils/lobby_states_enum');
var PlayerFactory = require('./player_factory.js');
var RoomStatesEnum = require('../utils/room_states_enum.js');
var SnapshotManager = require('../../shared/core/snapshot_manager');
var TeamManager = require('./team_manager.js');
var Team = require('./team.js');

var game_config = require('../../shared/settings/game_config.json');
var team_settings = require('../../shared/settings/teams.json');

function Room(socket) {
	this.clients = [];
	this.snapshots = new SnapshotManager();
	this.lobbyManager = new LobbyManager(this.clients);
	this.gameManager = new GameManager();
	
	this._socket = socket;
	this._sendGameSyncTickRate = game_config.network_tick_rate;
	this._lobbyInfoRate = game_config.lobby_tick_rate;
	this._allReadyDuration = game_config.all_ready_duration;
	this._transitionDuration = game_config.transition_duration;
}

Room.prototype.init = function() {
	this.createManagerListeners ();
	
	PlayerFactory.init(this);
	this.gameManager.init();
	this.lobbyManager.init();

	this._roomState =  RoomStatesEnum.LOBBY;
	
	this.lobbyStateEnter();
	this._socket.sockets.on('connect', this.onConnection.bind(this));
	this._gameLoopInterval = setInterval(this.update.bind(this), game_config.game_tick_rate);
};

Room.prototype.createManagerListeners = function () {
	//lobby
	this.lobbyManager.on('state.allready', this.allReadyStateEnter.bind(this));
	this.lobbyManager.on('state.done', this.transitionStateEnter.bind(this));

	//game
	this.gameManager.on('state.playing',this.playingStateEnter.bind(this));
	this.gameManager.on('state.endtransition', this.transitionState2Enter.bind(this));
	this.gameManager.on('state.endgame', this.endGameStateEnter.bind(this));
};

Room.prototype.update = function() {
	switch (this._roomState) {
		case RoomStatesEnum.LOBBY:
			// console.log('ROOM: in lobby!');
			this.lobbyManager.updateState();
			if (this.lobbyManager.state === LobbyStatesEnum.DONE) {
				this.preGameStateEnter();
				this._roomState = RoomStatesEnum.GAME;
				this.gameManager.startGame();
			}
			break;
		case RoomStatesEnum.GAME:
			// console.log('ROOM: in game!');
			this.gameManager.updateState();
			if (this.gameManager.state === GameStatesEnum.DONE) {
				console.log('ROOM: finished game - return to lobby!')
				this.clients = [];
				this.clearPlayers();///////////////////////////////////////////////
				this.initializeClients();		
				this._roomState = RoomStatesEnum.LOBBY;
				this.lobbyStateEnter();
			}
			break;
	}
};


/********************************************/
/****************** STATES ******************/
/********************************************/
Room.prototype.lobbyStateEnter = function() {   
	console.log('Changed state to lobby!');	
	this.sendChangedStateToClients('lobby');
	this._sendLobbyInfoInterval = setInterval(this.sendLobbyInfoToClients.bind(this),
												this._lobbyInfoRate);
};

Room.prototype.allReadyStateEnter = function() {   
	console.log('Changed state to allReady!');
	clearInterval(this._sendLobbyInfoInterval);
	this.sendChangedStateToClients('countdown');
	this.clearClientListeners();
	this._startTime = new Date();
};

Room.prototype.transitionStateEnter = function() {   
	console.log('Changed state to transition!');
	this.sendChangedStateToClients('preGame');
	this._startTime = new Date();
};

Room.prototype.preGameStateEnter = function() {   
	console.log('Changed state to preGame!');
	this.initializeGame();
	this.sendInitialMatchInfoToClients();
	this._startTime = new Date();
};

Room.prototype.playingStateEnter = function() {
	console.log('Changed state to playing!');
	this.sendChangedStateToClients('playing');
	this.startListeningToUpdates();
    this._sendSyncInterval = setInterval(this.sendSyncToClients.bind(this),
    										this._sendGameSyncTickRate);
	this._startTime = new Date();
};

Room.prototype.transitionState2Enter = function() {   
	console.log('Changed state to transition2!');
	this.sendChangedStateToClients('endGame');
	this._startTime = new Date();
};

Room.prototype.endGameStateEnter = function() {
	this.gameManager.updateState();
	console.log('Changed state to endGame!');
	clearInterval(this._sendSyncInterval);
	this.sendMatchResultsToClients();
	this._startTime = new Date();
};


/******************************************************/
/****************** HELPER FUNCTIONS ******************/
/******************************************************/
Room.prototype.clearPlayers = function() {
	_.each(this.clients, function(client) {
		client.player = null;
		client.team = null;
		client.ready = false;
	});
};

Room.prototype.initializeClients = function() {
	_.each(this.clients, function(client) {
		client.initialize();
	});
};

Room.prototype.initializeGame = function() {
	// this.createInitialEntities();
	_.each(this.clients, function(client) {
		client.createPlayer();
	});	
};

Room.prototype.removeClient = function(client) {
	for(var i = this.clients.length - 1; i >= 0; i--) {
	    if(this.clients[i] === client) {
	       this.clients.splice(i, 1);
	    }
	}
};

Room.prototype.startListeningToUpdates = function() {	
	_.each(this.clients, function(client) {
			client.startListeningToUpdates();
	});
};

Room.prototype.clearClientListeners = function() {	
	_.each(this.clients, function(client) {
			client.clearClientListeners();
	});
};

Room.prototype.validateTeam = function(name) {
	var found = _.find(team_settings.teams, function(team){
		return team.name === name;
	});
	return !_.isUndefined(found);
};


/*******************************************************/
/****************** NETWORK CALLBACKS ******************/
/*******************************************************/
Room.prototype.onConnection = function(socket) {
	// console.log('onconection');
	var client = new Client(socket, this);
	client.init();
};


/****************************************************/
/****************** SYNC FUNCTIONS ******************/
/****************************************************/
Room.prototype.sendChangedStateToClients = function(newState) {
	_.each(this.clients, function(client) {
			client.sendChangedState(newState);
	});
};

Room.prototype.sendGameSyncToClients = function(snapshot) {
	// console.log(snapshot);
	_.each(this.clients, function(client) {
			client.sendGameSync(snapshot);
	});
};

Room.prototype.sendInitialMatchInfoToClients = function() {
	var info = null;
	var currentClient = null;
	var numberOfClients = this.clients.legth;
	for (var i = 0; i < this.clients.length; i++) {
		currentClient = this.clients.shift();
		// console.log('currentClient', currentClient.name);
		info = {};
		_.each(this.clients, function(remotePlayer) {
			// console.log('\tRemotePlayer', remotePlayer.name);
			var id = remotePlayer.player.id;
			info[id] = { name: remotePlayer.name,
						 transform: remotePlayer.player.transform.getPosition(),
						 initialAttrs: remotePlayer.player.initialAttrs.getAll() };
		});		
		this.clients.push(currentClient);
		// console.log(info);
		currentClient.sendInitialMatchInfo(info);
	}
};

Room.prototype.sendLobbyInfoToClients = function() {
	var lobbyInfo = { teams: {} };
	_.each(this.clients, function(client) {
		var team = client.chosenTeam;
		if (this.validateTeam(team)) {
			if (!lobbyInfo.teams[team]) {
				lobbyInfo.teams[team] = [];
			}
			lobbyInfo.teams[team].push( { name: client.name,
										  ready: client.ready
			});			
		}
	}.bind(this));
	_.each(this.clients, function(client) {
		client.sendLobbyInfo(lobbyInfo);
	});
};

Room.prototype.sendMatchResultsToClients = function() {
	var results = { teams: {} };
	_.each(this.clients, function(client) {
		var team = client.chosenTeam;
		if (this.validateTeam(team)) {
			if (!results.teams[team]) {
				results.teams[team] = [];
			}
			results.teams[team].push( { name: client.name,
									    kills: client.player.components.get('player').kills,
									    deaths: client.player.components.get('player').deaths
			});			
		}
	}.bind(this));
	_.each(this.clients, function(client) {
		client.sendMatchResults(results);
	});
};

Room.prototype.sendSyncToClients = function() {
	var clientSnapshot = {};
	clientSnapshot.players = {};
	clientSnapshot.bullets = {};
	clientSnapshot.strongholds = {};
	clientSnapshot.mines = {};
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
		else if( entity.key === 'mine_collision_manager' ){
			// console.log(entity);
			// console.log(entity.components);
			var mineCollisionManager = entity.components.get('mine_collision_manager');
			if(mineCollisionManager.hasCollision()){
				// console.log('Server has new collision to send')
				// console.log('mineCollisionManager.getCollisions() = ' + mineCollisionManager.getCollisions());
				clientSnapshot.mineCollisions = mineCollisionManager.getCollisions();
				mineCollisionManager.clearCollisions();
			}

			_.each( entity.subentityManager.getAll(), function(mine){
				if(mine.components.get('mine_controller').sent === false){
					mine.components.get('mine_controller').sent = true;
					clientSnapshot.mines[mine.id] = mine.transform.getTransform();
				}
			});
		}
	});
	this.sendGameSyncToClients(clientSnapshot);
};

module.exports = Room;