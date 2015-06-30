'use strict'

//var BaseComponent = require('../../shared/components/SelfPlayerStatesManager_controller');
var GameComponent = require('../../shared/core/component.js');
var PlayerEnum = require('../../shared/utils/player_enum.js');
var game_states_settings = require('../../shared/settings/game_states.json');

function SelfPlayerStatesManager() {
	this.key = "self_player_states";
	this._respawnTime = null;
};

///
SelfPlayerStatesManager.prototype = Object.create(GameComponent.prototype);
SelfPlayerStatesManager.prototype.constructor = SelfPlayerStatesManager;
///

SelfPlayerStatesManager.prototype.init = function() {
	this.owner.on('entity.die', this.onEntityDie.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
};

SelfPlayerStatesManager.prototype.update = function() {
};

SelfPlayerStatesManager.prototype.openRespawnDialogBox = function() {
	var rdb = EZGUI.components.respawnDialogBox;
	rdb.visible = true;
	rdb.alpha = 0;
	rdb.animateFadeIn(1000, EZGUI.Easing.Linear.None);
};

SelfPlayerStatesManager.prototype.countRespawnTime = function() {
	EZGUI.components.respawnTime.text = game_states_settings.respawn_time;
    this._respawnTime = game_states_settings.respawn_time;
    var that = this;
    setInterval(function() {
        that._respawnTime--;

        if (that._respawnTime >= 0) {
           EZGUI.components.respawnTime.text = that._respawnTime.toString();
        }
    }, 1000);
};

SelfPlayerStatesManager.prototype.closeRespawnDialogBox = function() {
	var rdb = EZGUI.components.respawnDialogBox;
	rdb.visible = false;
};

SelfPlayerStatesManager.prototype.onEntityDie = function() {
	this.openRespawnDialogBox();
	this.countRespawnTime();
};

SelfPlayerStatesManager.prototype.onEntityRevive = function() {
	this.closeRespawnDialogBox();
};

module.exports = SelfPlayerStatesManager;