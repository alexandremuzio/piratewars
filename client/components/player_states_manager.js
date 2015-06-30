'use strict'

var BaseComponent = require('../../shared/components/player_states_manager.js');
var PlayerEnum = require('../../shared/utils/player_enum.js');

function PlayerStatesManager() {
	BaseComponent.call(this);
};

///
PlayerStatesManager.prototype = Object.create(BaseComponent.prototype);
PlayerStatesManager.prototype.constructor = PlayerStatesManager;
///

PlayerStatesManager.prototype.update = function() {
	/* Check when revive, special case for client */
	if (this._state == PlayerEnum.ALIVE && this._lastState == PlayerEnum.DEAD) {
		this.owner.revive();
	}
};

module.exports = PlayerStatesManager;