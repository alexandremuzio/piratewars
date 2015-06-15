'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');

function SpriteComponent(sprite) {
	// console.log("inside SpriteComponent constr");
	this.key = "sprite";
	this.sprite = sprite;
};

///
SpriteComponent.prototype = Object.create(GameComponent.prototype);
SpriteComponent.prototype.constructor = SpriteComponent;
///

SpriteComponent.prototype.init = function() {
	this.owner.on('entity.destroy', this.onEntityDestroy.bind(this));	
}

SpriteComponent.prototype.update = function() {
	var transform = this.owner.components.get("physics").getTransform();
	this.sprite.position.x = transform.position.x;
	this.sprite.position.y = transform.position.y;
	this.sprite.angle = transform.angle;
}

SpriteComponent.prototype.setScale = function(x, y) {
	this.sprite.scale.setTo(x, y);
}

SpriteComponent.prototype.setAnchor = function(x, y) {
	this.sprite.anchor.setTo(x, y);
}

SpriteComponent.prototype.onEntityDestroy = function() {
	this.sprite.destroy();
}

module.exports = SpriteComponent;