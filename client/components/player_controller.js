'use strict'

var BaseComponent = require('../../shared/components/player_controller');
var PlayerEnum = require('../../shared/utils/player_enum.js');

function Player() {
	this.key = "player";
	this._state = null; // States: PREGAME: 0, ALIVE: 1, DEAD: 2
	this._lastState = null;
	tihs._respawnTime = null;
};

///
Player.prototype = Object.create(BaseComponent.prototype);
Player.prototype.constructor = Player;
///

Player.prototype.init = function() {
	var deadPlayerSprite = this.owner.components.get('sprite').getSprite('dead_boat');

	deadPlayerSprite.animations.add('deadBoatAnim');
	deadPlayerSprite.kill();

	this._state = PlayerEnum.PREGAME;
}

Player.prototype.update = function() {
	if (this._state == PlayerEnum.DEAD && this._lastState == PlayerEnum.ALIVE) {
		// Update sprite and show respawn time
		var spriteComponent = this.owner.components.get('sprite');
		spriteComponent.revive('dead_boat');
		spriteComponent.kill('boat');
		spriteComponent.play('dead_boat', 'deadBoatAnim', 5, true);
	}
	if (this._state == PlayerEnum.ALIVE && this._lastState == PlayerEnum.DEAD) {
		// Set sprite
		spriteComponent.kill('dead_boat');
		spriteComponent.revive('boat');
	}
}

Player.prototype.openRespawnDialogBox = function() {
	var rdb = EZGUI.components.respawnDialogBox;
	rdb.visible = true;
	rdb.alpha = 0;
	rdb.animateFadeIn(500, EZGUI.Easing.Linear.None);
}
// Player.prototype.update = function(){ 
// 	console.log(this.owner.components.get("physics").body.position);
// }

module.exports = Player;