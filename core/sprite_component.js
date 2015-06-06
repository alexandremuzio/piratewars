'use strict'

var GameEngine = require('./game_engine.js');
var GameComponent = require('./game_component.js');

function SpriteComponent(game, spriteName) {
	console.log("inside SpriteComponent constr");
	this.key = "sprite";
	this.game = game;
	this.spriteName = spriteName;
	this.sprite = null;
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

SpriteComponent.prototype.init = function() {
	this.sprite = this.game.add.sprite(
		this.owner.components.get("physics").body.position[0],
		this.owner.components.get("physics").body.position[1],
		this.spriteName);
	this.sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
    this.sprite.scale.setTo(0.5, 0.5);
    this.sprite.tint = 0xff6600;
}

SpriteComponent.prototype.update = function() {
	var body = this.owner.components.get("physics").body;
	this.sprite.position.x = body.position[0];
	this.sprite.position.y = body.position[1];
	this.sprite.angle = body.angle;
};

module.exports = SpriteComponent;