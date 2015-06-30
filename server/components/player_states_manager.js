'use strict'

var BaseComponent = require('../../shared/components/player_states_manager.js');
var PlayerEnum = require('../../shared/utils/player_enum.js');
var game_states_settings = require('../../shared/settings/game_states.json');

function PlayerStatesManager() {
	this.key = "player_states";
	this._state = null; // States: PREGAME: 0, ALIVE: 1, DEAD: 2
	this._lastState = null;
	this._respawnTime = null;
};

///
PlayerStatesManager.prototype = Object.create(BaseComponent.prototype);
PlayerStatesManager.prototype.constructor = PlayerStatesManager;
///

PlayerStatesManager.prototype.init = function() {
	this._state = PlayerEnum.ALIVE;
	this.owner.on('entity.die', this.onEntityDie.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
};

PlayerStatesManager.prototype.update = function() {
};

PlayerStatesManager.prototype.onEntityDie = function() {
	this.setState(PlayerEnum.DEAD);
	this._respawnTime = game_states_settings.respawn_time;
    var that = this;

    var intervalID = setInterval(function() {
        that._respawnTime--;
        if (that._respawnTime < 0) {
        	that.owner.revive();
        	clearInterval(intervalID);
        }
    }, 1000);
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