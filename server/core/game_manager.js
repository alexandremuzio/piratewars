'use strict';

var _ = require('underscore');
var events = require('events');
var util = require('util');
var GameEngine = require('../../shared/game_engine.js');
var GameStatesEnum = require('../utils/game_states_enum');
var PlayerFactory = require('./player_factory');
var Team = require('./team');
var TeamManager = require('./team_manager');

var game_config = require('../../shared/settings/game_config.json');
var team_settings = require('../../shared/settings/teams.json');

function GameManager() {
	events.EventEmitter.call(this);

	this.teams = new TeamManager();

	this._transitionDuration = game_config.transition_duration;
	this._preGameDuration = game_config.pre_game_duration;
	this._endGameDuration = game_config.end_game_duration;
}

util.inherits(GameManager, events.EventEmitter);
// GameManager.prototype = events.EventEmitter.prototype;

GameManager.prototype.init = function () {
	//initial State
	this.state = GameStatesEnum.PRE_GAME;
	this.createTeams();
};

GameManager.prototype.createTeams = function () {
	_.each(team_settings.teams, function (teamSetting) {
		var newTeam = new Team(teamSetting, this);
		this.teams.add(teamSetting.name, newTeam);
	}, this);
};

GameManager.prototype.createInitialEntities = function () {
	this._stronghold0 = PlayerFactory.createStronghold(0);
	this._stronghold1 = PlayerFactory.createStronghold(1);
};

GameManager.prototype.gameEnded = function () {
	return this._stronghold0.components.get('health').currentHealth <= 0 ||
		this._stronghold1.components.get('health').currentHealth <= 0;
};

GameManager.prototype.startGame = function () {
	this._startTime = new Date();
	this.createInitialEntities();
};

GameManager.prototype.updateState = function () {
	this._currentTime = new Date();
	
	switch (this.state) {
		case GameStatesEnum.PRE_GAME:
			// console.log('GM: In pregame!');
			if (this._currentTime - this._startTime > this._preGameDuration) {
				this.state = GameStatesEnum.PLAYING;
				this.emit('state.playing');
			}
			break;
		case GameStatesEnum.PLAYING:
			// console.log('GM: In playing!');
			if (this.gameEnded()) {
				this.state = GameStatesEnum.END_GAME_TRANSITION;
				this.emit('state.endtransition');
			}
			GameEngine.getInstance().gameStep();
			break;
		case GameStatesEnum.END_GAME_TRANSITION:
			// console.log('GM: in end transition');
			if (this._currentTime - this._startTime > this._transitionDuration) {
				this.state = GameStatesEnum.END_GAME;
				this.emit('state.endgame');
			}
			break;
		case GameStatesEnum.END_GAME:
			// console.log('GM: In endGame!');
			if (this._currentTime - this._startTime > this._endGameDuration) {
				this.state = GameStatesEnum.DONE;
			}
			break;
		case GameStatesEnum.DONE:
			// console.log('GM: in done!');
			break;
	}
};

module.exports = GameManager;