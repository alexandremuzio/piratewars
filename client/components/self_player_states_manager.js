'use strict';

//var BaseComponent = require('../../shared/components/SelfPlayerStatesManager_controller');
var GameComponent = require('../../shared/core/component.js');
var game_time_settings = require('../../shared/settings/game_time.json');

function SelfPlayerStatesManager(game) {
	this.game = game;
	this.key = 'self_player_states';
	this._currentRespawnTime = null;
	this._currentTime = null;
}

///
SelfPlayerStatesManager.prototype = Object.create(GameComponent.prototype);
SelfPlayerStatesManager.prototype.constructor = SelfPlayerStatesManager;
///

SelfPlayerStatesManager.prototype.init = function () {
	this.owner.on('entity.die', this.onEntityDie.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
};

SelfPlayerStatesManager.prototype.update = function () {
	if (this._currentRespawnTime) {
		var newCurrentTime = new Date();
		var timestamp = this._currentRespawnTime / 1000 | 0; //Seconds unit of currentRespawnTime
		
		this._currentRespawnTime -= (newCurrentTime - this._currentTime);
		this._currentTime = newCurrentTime;

		if (this._currentRespawnTime >= 0 && timestamp !== (this._currentRespawnTime / 1000 | 0)) {
			console.log(timestamp);
			console.log(this._currentRespawnTime / 1000 | 0);
			EZGUI.components.respawnTime.text = (this._currentRespawnTime / 1000 | 0).toString();
		}
	}
};

SelfPlayerStatesManager.prototype.openRespawnDialogBox = function () {
	var rdb = EZGUI.components.respawnDialogBox;
	rdb.visible = true;
	rdb.alpha = 0;
	rdb.animateFadeIn(1000, EZGUI.Easing.Linear.None);
    EZGUI.components.respawnTime.text = game_time_settings.respawn_time;
};

SelfPlayerStatesManager.prototype.closeRespawnDialogBox = function () {
	var rdb = EZGUI.components.respawnDialogBox;
	rdb.visible = false;
};

SelfPlayerStatesManager.prototype.onEntityDie = function () {
	this._currentRespawnTime = game_time_settings.respawn_time;
	this._currentTime = new Date();

    this.openRespawnDialogBox();
};

SelfPlayerStatesManager.prototype.onEntityRevive = function () {
	this._currentRespawnTime = null;
	this.closeRespawnDialogBox();
};


module.exports = SelfPlayerStatesManager;