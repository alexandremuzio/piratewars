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
	this._preGameDuration = 1000;
	this._endGameDuration = 500;
}

Room.prototype.init = function() {
	var testClient = new Client(null, this);
	testClient.onName("nome do cliente1");
	testClient.onChangeTeam("red");
	testClient.onReady(true);

	testClient = new Client(null, this);
	testClient.onName("nome do cliente2");
	testClient.onChangeTeam("blue");
	testClient.onReady(false);
	testClient.onReady(true);

	testClient = new Client(null, this);
	testClient.onName("nome do cliente3");
	testClient.onChangeTeam("blue");
	testClient.onReady(true);

	testClient = new Client(null, this);
	testClient.onName("nome do cliente4");
	testClient.onChangeTeam("blue");
	testClient.onReady(true);

	testClient = new Client(null, this);
	testClient.onName("on weakest team");
	testClient.onReady(true);

	console.log(this.allClientsAreReady());

	// this.sendLobbyInfoToClients();


	PlayerFactory.init(this);
	this.createInitialEntities();
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
	this._sendLobbyInfoInterval = setInterval(this.sendLobbyInfo.bind(this),
												this._lobbyInfoRate);
}
Room.prototype.lobbyStateLoop = function() {
	if (this.allClientsAreReady()) {
		clearInterval(this._sendLobbyInfoInterval);
		this.sendLobbyInfo();
		this.sendCountdownToClients();
		this._gameState = this.allReadyStateLoop;
		this.allReadyStateInit();
	}
}

Room.prototype.allReadyStateInit = function() {   
	console.log("Changed state to allReady!");	
	this.sendChangedStateToClients('countdown');
	this._startTime = new Date();
}
Room.prototype.allReadyStateLoop = function() {
	var currentTime = new Date();
	if (currentTime - this._startTime > this._allReadyDuration) {
		this._gameState = this.preGameStateLoop;
		this.preGameStateInit();
	}
}

Room.prototype.preGameStateInit = function() {   
	console.log("Changed state to preGame!");
	this.sendChangedStateToClients('preGame');
	this.initializeGame();
	this.sendFullInfoToClients();
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
    this._sendSyncInterval = setInterval(this.sendGameSyncToClients.bind(this),
    										this._sendGameSyncTickRate);
	this._startTime = new Date();
}
Room.prototype.playingStateLoop = function() {
	var currentTime = new Date();
	if (checkEndGame()) {
		this._gameState = this.endGameStateLoop;
		this.endGameStateInit();
	}
	GameEngine.getInstance().gameStep();
}

Room.prototype.endGameStateInit = function() {
	console.log("Changed state to endGame!");
	clearInterval(this._sendSyncInterval);
	this.sendChangedStateToClients('endGame');
	this._startTime = new Date();
}
Room.prototype.endGameStateLoop = function() {
	var currentTime = new Date();
	if (currentTime - this._startTime > this._endGameDuration) {
		this._gameState = this.lobbyStateLoop;
		this.lobbyStateInit();
	}
}


/******************************************************/
/****************** HELPER FUNCTIONS ******************/
/******************************************************/
Room.prototype.allClientsAreReady = function() {
	var allReady = true;
	_.each(this.clients, function(client) {
		if (!client.ready) {
			allReady = false;
			return;
		}
	});
	return allReady;
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

Room.prototype.initializeGame = function() {
	
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
Room.prototype.sendFullInfoToClients = function() {

}

Room.prototype.sendLobbyInfoToClients = function() {
	var lobbyInfo = {}
	_.each(this.clients, function(client) {
		var team = client.chosenTeam;
		if (this.validateTeam(team)) {
			if (!lobbyInfo[team]) {
				lobbyInfo[team] = [];
			}
			lobbyInfo[team].push( { name: client.name,
									ready: client.ready
			});			
		}
	}.bind(this));
	console.log(lobbyInfo);
	_.each(this.clients, function(client) {
		client.sendLobbyInfo(lobbyInfo);
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