'use strict'

var BaseComponent = require('../core/component.js');

var mine_settings = require('../settings/mine.json');
var GameEngine = require('../game_engine.js');

function MineController() {
	this.key = "mine_controller";
	this._createdTime = new Date();
};

///
MineController.prototype = Object.create(BaseComponent.prototype);
MineController.prototype.constructor = MineController;
///

MineController.prototype.init = function() {
	this.owner.on("entity.collision", this.onCollision.bind(this));
}

MineController.prototype.update = function(){ 
	var currentTime = new Date();
	if( currentTime - this._createdTime > mine_settings.sink_time ){
		// console.log('fbsd');
		// GameEngine.getInstance().printEntityHierarchy();
		this.owner.destroy();
	}
}

// Bug:
// O Id das minas remotas nao corresponde ao id do player que a lançou
MineController.prototype.onCollision = function(collider) {
	if ((collider.key === "player" || collider.key === "remote_player") && (!this.isMineFromPlayer(collider.id) || this.autoDemageOn()) ) {
		// console.log('collider.key = ' + collider.key);
		this.owner.destroy();
		collider.damage(mine_settings.damage, collider);
		// console.log("damaging player!");
		// console.log('damage:' + mine_settings.damage);
		this.onCollisionOcured(collider);
	}
};

MineController.prototype.forceCollision = function(player) {
	this.owner.destroy();
	player.damage(mine_settings.damage, player);
};

MineController.prototype.autoDemageOn = function(collider) {
	var currentTime = new Date();
	return currentTime - this._createdTime > mine_settings.auto_damage_time;
};

MineController.prototype.isMineFromPlayer = function(playerId) {
	if( this.owner.id )
		return this.owner.id.indexOf(playerId) > -1;
	else{
		console.error('this.owner.id = ' + this.owner.id);
		console.log(this);
		console.log(this.owner);
	}
}


module.exports = MineController;