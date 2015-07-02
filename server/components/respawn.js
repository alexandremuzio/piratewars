'use strict'

var GameComponent = require('../../shared/core/component.js');
var SpawnManager = require('../core/spawn_manager.js')
var game_time_settings = require('../../shared/settings/game_time.json');
var _ = require('underscore');

function RespawnComponent() {
	this.key = "respawn";
	this._currentRespawnTime = null;
	this._currentTime = null;
};

///
RespawnComponent.prototype = Object.create(GameComponent.prototype);
RespawnComponent.prototype.constructor = RespawnComponent;
///

RespawnComponent.prototype.init = function() {
	this.owner.on('entity.die', this.onEntityDie.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
};

RespawnComponent.prototype.update = function() {
	if (!_.isNull(this._currentRespawnTime) && !_.isUndefined(this._currentRespawnTime)) {
		var newCurrentTime = new Date();
		
		this._currentRespawnTime -= (newCurrentTime - this._currentTime);
		this._currentTime =  newCurrentTime;
		
		if(this._currentRespawnTime < 0) {
			this.owner.revive();
		}
	}
};

RespawnComponent.prototype.onEntityDie = function() {
	this._currentRespawnTime = game_time_settings.respawn_time;
	this._currentTime = new Date();
};

RespawnComponent.prototype.onEntityRevive = function() {
	this._currentRespawnTime = null;

	var position = SpawnManager.getSpawnPosition(0);
	console.log('respawning entity');
	console.log(position);
	if (!_.isNull(position) && !_.isUndefined(position))
		this.owner.transform.setPosition(position);
};

module.exports = RespawnComponent;