'use strict'

//var BaseComponent = require('../../shared/components/PlayerStatesManager_controller');
var GameComponent = require('../../shared/core/component.js');
var PlayerEnum = require('../../shared/utils/player_enum.js');

function PlayerStatesManager() {
	this.key = "player_states";
	this._state = null; // States: PREGAME: 0, ALIVE: 1, DEAD: 2
	this._lastState = null;
	this._respawnTime = null;
};

///
PlayerStatesManager.prototype = Object.create(GameComponent.prototype);
PlayerStatesManager.prototype.constructor = PlayerStatesManager;
///

PlayerStatesManager.prototype.init = function() {
	this._state = PlayerEnum.ALIVE;
	this.owner.on('entity.die', this.onEntityDie.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
};

PlayerStatesManager.prototype.onEntityDie = function() {
	this.setState(PlayerEnum.DEAD);
};

PlayerStatesManager.prototype.onEntityRevive = function() {
	this.setState(PlayerEnum.ALIVE);
};

PlayerStatesManager.prototype.setState = function(newState) {
	this._lastState = this._state;
	this._state = newState;
}

PlayerStatesManager.prototype.getState = function() {
	return this._state;
}

module.exports = PlayerStatesManager;