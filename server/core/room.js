'use strict';


//TEMP
var GameStatesEnum = require('../utils/game_states_enum');

var _ = require('underscore');
var Client = require('./client.js');
var GameEngine = require('../../shared/game_engine.js');
var GameManager = require('./game_manager.js');
var PlayerFactory = require('./player_factory.js');
var RoomStatesEnum = require('../utils/room_states_enum.js');
var SnapshotManager = require('../../shared/core/snapshot_manager');
var TeamManager = require('./team_manager.js');
var Team = require('./team.js');

var game_config = require('../../shared/settings/game_config.json');
var team_settings = require('../../shared/settings/teams.json');

function Room(socket) {

	this.teams = new TeamManager();
	this.playerCount = 0;
	this.clients = [];
	this.snapshots = new SnapshotManager();
	
	this.gameManager = new GameManager();
	this._socket = socket;
	this._gameState = null;
	this._startTime = null;
	// Send these to conf files
	this._sendGameSyncTickRate = 1000/20;
	this._lobbyInfoRate = 1000/2;
	this._allReadyDuration = 1000;
	this._transitionDuration = 1000;
	this._preGameDuration = 1000;
	this._endGameDuration = 500;
}

Room.prototype.init = function() {

	//TEST
	// this.createTeams();

	// var testClient = new Client(this._socket, this);
	// testClient.onName('nome do cliente1');
	// testClient.onChangeTeam('red');
	// testClient.onReady(true);

	// testClient = new Client(this._socket, this);
	// testClient.onName('nome do cliente2');
	// testClient.onChangeTeam('blue');
	// testClient.onReady(false);
	// testClient.onReady(true);

	// testClient = new Client(this._socket, this);
	// testClient.onName('nome do cliente3');
	// testClient.onChangeTeam('blue');
	// testClient.onReady(true);

	// testClient = new Client(this._socket, this);
	// testClient.onName('nome do cliente4');
	// testClient.onChangeTeam('blue');
	// testClient.onReady(true);

	// testClient = new Client(this._socket, this);
	// testClient.onName('on weakest team');
	// testClient.onReady(true);

	// this.initializeGame();
	 // this.sendInitialMatchInfoToClients();
	// console.log(this.allClientsAreReady());
	// this.sendLobbyInfoToClients();
	
	this.gameManager.on('state.pregame', this.preGameStateInit.bind(this));
	this.gameManager.on('state.playing',this.playingStateInit.bind(this));
	this.gameManager.on('state.endtransition', this.transitionState2Init.bind(this));
	this.gameManager.on('state.endgame', this.endGameStateInit.bind(this));
	
	PlayerFactory.init(this);
	this.gameManager.init();

	this._roomState =  RoomStatesEnum.LOBBY;
	
	this.lobbyStateInit();
	this._socket.sockets.on('connect', this.onConnection.bind(this));
	this._gameLoopInterval = setInterval(this.gameLoop.bind(this), game_config.game_tick_rate);
};

Room.prototype.gameLoop = function() {
	this.update();
};

Room.prototype.update = function() {
	var currentTime = new Date();
	switch (this._roomState) {
		case RoomStatesEnum.LOBBY:
			console.log('ROOM: in lobby!');
			if (this.allClientsAreReady()) {
				clearInterval(this._sendLobbyInfoInterval);
				this.allReadyStateInit();
				this._roomState = RoomStatesEnum.LOBBY_ALL_READY;
			}
			break;
		//TODO - remove
		case RoomStatesEnum.LOBBY_ALL_READY:
			console.log('ROOM: in lobby all ready!');
			if (currentTime - this._startTime > this._allReadyDuration) {
				this.transitionStateInit();
				this._roomState = RoomStatesEnum.LOBBY_TRANSITION;
			}
			break;
		//TODO - remove
		case RoomStatesEnum.LOBBY_TRANSITION:
		console.log('ROOM: in transition!');
			if (currentTime - this._startTime > this._transitionDuration) {
				this.preGameStateInit();
				this._roomState = RoomStatesEnum.GAME;
				this.gameManager.startGame();
			}
			break;
		case RoomStatesEnum.GAME:
			console.log('ROOM: in game!');
			this.gameManager.updateState();
			if (this.gameManager.getState() === GameStatesEnum.DONE) {
				this._roomState = RoomStatesEnum.END_GAME;
			}
			break;
		case RoomStatesEnum.END_GAME:
			console.log('ROOM: finished game - return to lobby!')
			this.clients = [];
			this.clearPlayers();///////////////////////////////////////////////
			this.initializeClients();		
			this._roomState = RoomStatesEnum.LOBBY;
			this.lobbyStateInit();
			break;
	}
};


/********************************************/
/****************** STATES ******************/
/********************************************/
Room.prototype.lobbyStateInit = function() {   
	console.log('Changed state to lobby!');	
	this.sendChangedStateToClients('lobby');
	this._sendLobbyInfoInterval = setInterval(this.sendLobbyInfoToClients.bind(this),
												this._lobbyInfoRate);
};

Room.prototype.allReadyStateInit = function() {   
	console.log('Changed state to allReady!');	
	this.sendChangedStateToClients('countdown');
	this.clearClientListeners();
	this._startTime = new Date();
};

Room.prototype.transitionStateInit = function() {   
	console.log('Changed state to transition!');
	this.sendChangedStateToClients('preGame');
	this._startTime = new Date();
};

Room.prototype.preGameStateInit = function() {   
	console.log('Changed state to preGame!');
	this.initializeGame();
	this.sendInitialMatchInfoToClients();
	this._startTime = new Date();
};

Room.prototype.playingStateInit = function() {
	console.log('Changed state to playing!');
	this.sendChangedStateToClients('playing');
	this.startListeningToUpdates();
    this._sendSyncInterval = setInterval(this.sendSyncToClients.bind(this),
    										this._sendGameSyncTickRate);
	this._startTime = new Date();
};

Room.prototype.transitionState2Init = function() {   
	console.log('Changed state to transition2!');
	this.sendChangedStateToClients('endGame');
	this._startTime = new Date();
};

Room.prototype.endGameStateInit = function() {
	this.gameManager.updateState();
	console.log('Changed state to endGame!');
	clearInterval(this._sendSyncInterval);
	this.sendMatchResultsToClients();
	this._startTime = new Date();
};


/******************************************************/
/****************** HELPER FUNCTIONS ******************/
/******************************************************/
Room.prototype.allClientsAreReady = function() {
	var allReady = true;
	if (this.clients.length === 0 || 
		this.getWeakestChosenTeamSize() === 0) return false; /////////////////////////

	_.each(this.clients, function(client) {
		if (!client.ready) {
			allReady = false;
			return;
		}
	});
	return allReady;
};

Room.prototype.clearPlayers = function() {
	_.each(this.clients, function(client) {
		client.player = null;
		client.team = null;
		client.ready = false;
	});
};

Room.prototype.createInitialEntities = function() {
	this._stronghold0 = PlayerFactory.createStronghold(0);
	this._stronghold1 = PlayerFactory.createStronghold(1);
};

Room.prototype.initializeClients = function() {
	_.each(this.clients, function(client) {
		client.initialize();
	});
};

Room.prototype.initializeGame = function() {
	this.createInitialEntities();
	_.each(this.clients, function(client) {
		client.createPlayer();
	});	
};

Room.prototype.getWeakestChosenTeam = function() {
	var teamSize = {};	
	_.each(team_settings.teams, function(team) {
		teamSize[team.name] = 0;
	}, this);
	_.each(this.clients, function(client) {
		var team = client.chosenTeam;
		if (this.validateTeam(team)) {
			teamSize[team]++;
		}
	}.bind(this));
	return _.min(_.keys(teamSize), function(team) {
		return teamSize[team];
	});
};

Room.prototype.getWeakestChosenTeamSize = function() { ////////////////
	var teamSize = {};	
	_.each(team_settings.teams, function(team) {
		teamSize[team.name] = 0;
	}, this);
	_.each(this.clients, function(client) {
		var team = client.chosenTeam;
		if (this.validateTeam(team)) {
			teamSize[team]++;
		}
	}.bind(this));
	var minimum = 9999999;
	_.each(teamSize, function(team) {
		if (team < minimum)
			minimum = team;
	});
	// console.log(minimum);
	return minimum;
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