'use strict'

var GameEngine = require('./game_engine.js');
var GameComponent = require('./game_component.js');

function SpriteComponent(game) {
	console.log("inside SpriteComponent constr");
	this.key = "phaser";
	this.sprite = game.add.sprite(
		var body = this.owner.components.get("physics").body;
		this.owner.components.get("physics").body.position[0],
		this.owner.components.get("physics").body.position[1],
		"boat_0");
	this.sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
	this.update = function() {
		var body = this.owner.components.get("physics").body;
		this.sprite.position.x = body.position[0];
		this.sprite.position.y = body.position[1];
	}.bind(this);
};

///
SpriteComponent.prototype = Object.create(GameComponent.prototype);
SpriteComponent.prototype.constructor = SpriteComponent;
///

SpriteComponent.prototype.setScale = function(x, y) {
	this.sprite.scale.setTo(x, y);
}

SpriteComponent.prototype.setAnchor = function(x, y) {
	this.sprite.anchor.setTo(x, y);
}


module.exports = SpriteComponent;