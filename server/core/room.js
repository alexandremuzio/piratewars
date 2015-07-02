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
	// Send these to conf files
	this._sendGameSyncTickRate = 1000/20;
	this._lobbyInfoRate = 1000;
	this._allReadyDuration = 1000;
	this._transitionDuration = 1000;
	this._preGameDuration = 1000;
	this._endGameDuration = 500;
}

Room.prototype.init = function() {

	// this.createTeams();

	// var testClient = new Client(this._socket, this);
	// testClient.onName("nome do cliente1");
	// testClient.onChangeTeam("red");
	// testClient.onReady(true);

	// testClient = new Client(this._socket, this);
	// testClient.onName("nome do cliente2");
	// testClient.onChangeTeam("blue");
	// testClient.onReady(false);
	// testClient.onReady(true);

	// testClient = new Client(this._socket, this);
	// testClient.onName("nome do cliente3");
	// testClient.onChangeTeam("blue");
	// testClient.onReady(true);

	// testClient = new Client(this._socket, this);
	// testClient.onName("nome do cliente4");
	// testClient.onChangeTeam("blue");
	// testClient.onReady(true);

	// testClient = new Client(this._socket, this);
	// testClient.onName("on weakest team");
	// testClient.onReady(true);

	// this.initializeGame();
 // 	this.sendInitialMatchInfoToClients();



	// console.log(this.allClientsAreReady());

	// this.sendLobbyInfoToClients();


	PlayerFactory.init(this);
	this.createTeams();
	this._gameState = this.lobbyStateLoop;
	this.lobbyStateInit();
	this._socket.sockets.on('connect', this.onConnection.bind(this));
	this._gameLoopInterval = setInterval(this.gameLoop.bind(this), game_config.game_tick_rate);
}

Room.prototype.gameLoop = function() {
	this._gameState();
}


/********************************************/
/****************** STATES ******************/
/********************************************/
Room.prototype.lobbyStateInit = function() {   
	console.log("Changed state to lobby!");	
	this.sendChangedStateToClients('lobby');
	this._sendLobbyInfoInterval = setInterval(this.sendLobbyInfoToClients.bind(this),
												this._lobbyInfoRate);
}
Room.prototype.lobbyStateLoop = function() {
	if (this.allClientsAreReady()) {
		clearInterval(this._sendLobbyInfoInterval);
		this._gameState = this.allReadyStateLoop;
		this.allReadyStateInit();
	}
}

Room.prototype.allReadyStateInit = function() {   
	console.log("Changed state to allReady!");	
	this.sendChangedStateToClients('countdown');
	this.clearClientListeners();
	this._startTime = new Date();
}
Room.prototype.allReadyStateLoop = function() {
	var currentTime = new Date();
	if (currentTime - this._startTime > this._allReadyDuration) {
		this._gameState = this.transitionStateLoop;
		this.transitionStateInit();
	}
}

Room.prototype.transitionStateInit = function() {   
	console.log("Changed state to transition!");
	this.sendChangedStateToClients('preGame');
	this._startTime = new Date();
}
Room.prototype.transitionStateLoop = function() {
	var currentTime = new Date();
	if (currentTime - this._startTime > this._transitionDuration) {
		this._gameState = this.preGameStateLoop;
		this.preGameStateInit();
	}
}

Room.prototype.preGameStateInit = function() {   
	console.log("Changed state to preGame!");
	this.initializeGame();
	this.sendInitialMatchInfoToClients();
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
	console.log("Changed state to playing!");
	this.sendChangedStateToClients('playing');
	this.startListeningToUpdates();
    this._sendSyncInterval = setInterval(this.sendGameSyncToClients.bind(this),
    										this._sendGameSyncTickRate);
	this._startTime = new Date();
}
Room.prototype.playingStateLoop = function() {
	var currentTime = new Date();
	if (this.checkEndGame()) {
		this._gameState = this.transitionState2Loop;
		this.transitionState2Init();
	}
	GameEngine.getInstance().gameStep();
}

Room.prototype.transitionState2Init = function() {   
	console.log("Changed state to transition2!");
	this.sendChangedStateToClients('endGame');
	this._startTime = new Date();
}
Room.prototype.transitionState2Loop = function() {
	var currentTime = new Date();
	if (currentTime - this._startTime > this._transitionDuration) {
		this._gameState = this.endGameStateLoop;
		this.endGameStateInit();
	}
}

Room.prototype.endGameStateInit = function() {
	console.log("Changed state to endGame!");
	clearInterval(this._sendSyncInterval);
	this.sendMatchResultsToClients();
	this._startTime = new Date();
}
Room.prototype.endGameStateLoop = function() {
	var currentTime = new Date();
	if (currentTime - this._startTime > this._endGameDuration) {
		this.clearPlayers();///////////////////////////////////////////////
		this.initializeClients();		
		this._gameState = this.lobbyStateLoop;
		this.lobbyStateInit();
	}
}


/******************************************************/
/****************** HELPER FUNCTIONS ******************/
/******************************************************/
Room.prototype.allClientsAreReady = function() {
	var allReady = true;
	// console.log(this.getWeakestChosenTeamSize());
	if (this.clients.length === 0 || 
		this.getWeakestChosenTeamSize() == 0) return false; /////////////////////////

	_.each(this.clients, function(client) {
		if (!client.ready) {
			allReady = false;
			return;
		}
	});
	return allReady;
}

Room.prototype.clearPlayers = function() {
	_.each(this.clients, function(client) {
		client.player = null;
		client.team = null;
	});
}

Room.prototype.checkEndGame = function() {
	//TO DO!!
	return this._stronghold0.components.get('health').currentHealth <= 0 || 
		this._stronghold1.components.get('health').currentHealth <= 0;
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

Room.prototype.initializeClients = function() {
	_.each(this.clients, function(client) {
		client.initialize();
	});
}

Room.prototype.initializeGame = function() {
	this.createInitialEntities();
	_.each(this.clients, function(client) {
		client.createPlayer();
	});	
}

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
}

Room.prototype.getWeakestChosenTeamSize = function() { ////////////////
	var teamSize = {};	
	_.each(team_settings.teams, function(team) {
		teamSize[team.name] = 0;
	}, this);
	// console.log(teamSize);
	_.each(this.clients, function(client) {
		var team = client.chosenTeam;
		if (this.validateTeam(team)) {
			teamSize[team]++;
		}
	}.bind(this));
	// console.log(teamSize);
	var minimum = 9999999;
	_.each(teamSize, function(team) {
		if (team < minimum)
			minimum = team;
	});
	// console.log(minimum);
	return minimum;
}

Room.prototype.startListeningToUpdates = function() {	
	_.each(this.clients, function(client) {
			client.startListeningToUpdates();
	});
}

Room.prototype.clearClientListeners = function() {	
	_.each(this.clients, function(client) {
			client.clearClientListeners();
	});
}

Room.prototype.validateTeam = function(name) {
	var found = _.find(team_settings.teams, function(team){
		return team.name === name;
	});
	return !_.isUndefined(found);
}


/*******************************************************/
/****************** NETWORK CALLBACKS ******************/
/*******************************************************/
Room.prototype.onConnection = function(socket) {
	// console.log("onconection");
	var client = new Client(socket, this);
	client.init();
}


/****************************************************/
/****************** SYNC FUNCTIONS ******************/
/****************************************************/
Room.prototype.sendChangedStateToClients = function(newState) {
	_.each(this.clients, function(client) {
			client.sendChangedState(newState);
	});
}

Room.prototype.sendGameSyncToClients = function(snapshot) {
	_.each(this.clients, function(client) {
			client.sendGameSync(snapshot);
	});
}

Room.prototype.sendInitialMatchInfoToClients = function() {
	var info = null;
	var currentClient = null;
	var numberOfClients = this.clients.legth;
	for (var i = 0; i < this.clients.length; i++) {
		currentClient = this.clients.shift();
		// console.log("currentClient", currentClient.name);
		info = {};
		_.each(this.clients, function(remotePlayer) {
			// console.log("\tRemotePlayer", remotePlayer.name);
			var id = remotePlayer.player.id;
			info[id] = { name: remotePlayer.name,
						 transform: remotePlayer.player.transform.getPosition(),
						 initialAttrs: remotePlayer.player.initialAttrs.getAll() };
		});		
		this.clients.push(currentClient);
		// console.log(info);
		currentClient.sendInitialMatchInfo(info);
	}
}

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
	// console.log(lobbyInfo);
	_.each(this.clients, function(client) {
		client.sendLobbyInfo(lobbyInfo);
	});
}

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
}

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
}

module.exports = Room;