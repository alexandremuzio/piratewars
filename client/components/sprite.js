'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');

function SpriteComponent(sprite) {
	console.log("inside SpriteComponent constr");
	this.key = "sprite";
	this.sprite = sprite;
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
}

SpriteComponent.prototype.update = function() {
	var body = this.owner.components.get("physics").body;
	this.sprite.position.x = body.position[0];
	this.sprite.position.y = body.position[1];
	this.sprite.angle = body.angle;
};

module.exports = SpriteComponent;