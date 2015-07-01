'use strict'

var GameComponent = require('../../shared/core/component.js');
var game_time_settings = require('../../shared/settings/game_time.json');
var _ = require('underscore');

function RespawnManager() {
	this.key = "respawn";
	this._currentRespawnTime = null;
	this._currentTime = null;
};

///
RespawnManager.prototype = Object.create(GameComponent.prototype);
RespawnManager.prototype.constructor = RespawnManager;
///

RespawnManager.prototype.init = function() {
	this.owner.on('entity.die', this.onEntityDie.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
};

RespawnManager.prototype.update = function() {
	if (!_.isNull(this._currentRespawnTime) && !_.isUndefined(this._currentRespawnTime)) {
		var newCurrentTime = new Date();
		
		this._currentRespawnTime -= (newCurrentTime - this._currentTime);
		this._currentTime =  newCurrentTime;
		
		if(this._currentRespawnTime < 0) {
			this.owner.revive();
		}
	}
};

RespawnManager.prototype.onEntityDie = function() {
	this._currentRespawnTime = game_time_settings.respawn_time;
	this._currentTime = new Date();
};

RespawnManager.prototype.onEntityRevive = function() {
	this._currentRespawnTime = null;
};

module.exports = RespawnManager;