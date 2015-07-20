'use strict';

var BaseComponent = require('../../shared/components/player_controller');

function Player() {
	this.key = 'player';
}

///
Player.prototype = Object.create(BaseComponent.prototype);
Player.prototype.constructor = Player;
///

Player.prototype.init = function() {
	var deadPlayerSprite = this.owner.components.get('sprite').getSprite('dead_boat');

	deadPlayerSprite.animations.add('deadBoatAnim');
	deadPlayerSprite.kill();

	this.owner.on('entity.die', this.onEntityDie.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
};

Player.prototype.update = function() {
};

// Player.prototype.update = function(){ 
// 	console.log(this.owner.components.get('physics').body.position);
// }

Player.prototype.onEntityDie = function() {
	var spriteComponent = this.owner.components.get('sprite');
	spriteComponent.revive('dead_boat');
	spriteComponent.kill('boat');
	spriteComponent.play('dead_boat', 'deadBoatAnim', 5, true);
};

Player.prototype.onEntityRevive = function() {
	var spriteComponent = this.owner.components.get('sprite');
	spriteComponent.kill('dead_boat');
	spriteComponent.revive('boat');
};
module.exports = Player;