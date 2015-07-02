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

MineController.prototype.whoLaunchId = function() {
	return this.owner.id.substr(0, this.owner.id.indexOf('*'));
};

// O Id das minas remotas nao corresponde ao id do player que a lançou
MineController.prototype.onCollision = function(collider) {
	if ((collider.key === "player" || collider.key === "remote_player") && (!this.isMineFromPlayer(collider.id) || this.autoDemageOn()) ) {
		// console.log('collider.key = ' + collider.key);
		var attackerId = this.whoLaunchId();
		// console.log('attackerId = ' + attackerId);
		var attacker = GameEngine.getInstance().entities[attackerId];
		if(!attacker){
			console.log('WARNING: player ' + attackerId + '( who launch the mine ) not found on server');
		}
		collider.damage(mine_settings.damage, attacker);
		// console.log("damaging player!");
		// console.log('damage:' + mine_settings.damage);
		this.onCollisionOcured(collider);
		this.owner.destroy();
	}
};

MineController.prototype.forceCollision = function(player) {
	// console.log("forcing damaging player!");
	// console.log('damage:' + mine_settings.damage);
	var attackerId = this.whoLaunchId();
	// console.log('attackerId = ' + attackerId);
	var attacker = GameEngine.getInstance().entities[attackerId];
	if(!attacker){
		console.log('WARNING: player ' + attackerId + '( who launch the mine ) not found on server');
	}
	player.damage(mine_settings.damage, attacker);
	this.owner.destroy();
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