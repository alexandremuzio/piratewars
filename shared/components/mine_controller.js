'use strict'

var BaseComponent = require('../core/component.js');

var mine_settings = require('../settings/mine.json');
var GameEngine = require('../game_engine.js');

function MineController(shape) {
	this.key = "mine_controller";
	this._createdTime = new Date();
	this._shape = shape;
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
	if( this.collisionOn() && this.owner.components.get('physics').body.shapes.length === 0 ){
		this.owner.components.get('physics').body.addShape(this._shape);
	}
}

MineController.prototype.onCollision = function(collider) {
	if (collider.key == "player" || collider.key == "remote_player" ) {
		// console.log('collider.key = ' + collider.key);
		collider.damage(mine_settings.damage, collider);
		console.log("damaging player!");
		this.owner.destroy();
	}	
};
MineController.prototype.collisionOn = function(collider) {
	var currentTime = new Date();
	return currentTime - this._createdTime > mine_settings.auto_damage_time;
};

module.exports = MineController;