'use strict'

var GameComponent = require('../../shared/core/component.js');
var SpawnManager = require('../core/spawn_manager.js')
var game_time_settings = require('../../shared/settings/game_time.json');
var _ = require('underscore');

function RespawnComponent(team) {
	this.key = "respawn";
	this._currentRespawnTime = null;
	this._currentTime = null;
	this._teamName = team.name;
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

	var info = SpawnManager.getSpawnInfo(this._teamName);
	if (!_.isNull(info) && !_.isUndefined(info))
		this.owner.transform.setPosition({x: info.x, y: info.y});
		this.owner.transform.setAngle(info.angle);
};

module.exports = RespawnComponent;