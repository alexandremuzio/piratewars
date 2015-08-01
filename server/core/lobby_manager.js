//criar arquivo para cuidar das validacoes de sala
//lado do jogador, nome etc...

var _ = require('underscore');
var util = require('util');
var events = require('events');
var LobbyStatesEnum = require('../utils/lobby_states_enum');

var game_config = require('../../shared/settings/game_config.json');
var team_settings = require('../../shared/settings/teams.json');

function LobbyManager(clients) {
	events.EventEmitter.call(this);
	
	this.clients = clients;
	
	this._allReadyDuration = game_config.all_ready_duration;
	this._transitionDuration = game_config.transition_duration;
}

util.inherits(LobbyManager, events.EventEmitter);
// LobbyManager.prototype = events.EventEmitter.prototype;

LobbyManager.prototype.init = function () {
	//initial State
	this.state = LobbyStatesEnum.START;
	this._startTime = new Date();
};

LobbyManager.prototype.updateState = function () {
	this._currentTime = new Date();
	
	switch (this.state) {
		case LobbyStatesEnum.START:
			// console.log('LOBBY: in start!');
			if (this.allClientsAreReady()) {
				this.state = LobbyStatesEnum.ALL_READY;
				this.emit('state.allready');
			}
			break;
		case LobbyStatesEnum.ALL_READY:
			// console.log('LOBBY: in all ready!');
			if (this._currentTime - this._startTime > this._allReadyDuration) {
				this.state = LobbyStatesEnum.TRANSITION;
				this.emit('state.done')
			}
			break;
		case LobbyStatesEnum.TRANSITION:
			// console.log('LOBBY: in transition!');
			if (this._currentTime - this._startTime > this._transitionDuration) {
				this.state = LobbyStatesEnum.DONE;
			}
			break;
		case LobbyStatesEnum.DONE:
			// console.log('LOBBY: in done!');
			break;
	}
};

LobbyManager.prototype.allClientsAreReady = function() {
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

LobbyManager.prototype.getWeakestChosenTeam = function() {
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

LobbyManager.prototype.getWeakestChosenTeamSize = function() { ////////////////
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

LobbyManager.prototype.validateTeam = function(name) {
	var found = _.find(team_settings.teams, function(team){
		return team.name === name;
	});
	return !_.isUndefined(found);
};

module.exports = LobbyManager;