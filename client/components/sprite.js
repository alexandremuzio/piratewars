'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');

//private variable
var originalTextureRect;

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
	this.owner.on('entity.destroy', this.onEntityDestroy.bind(this));	/* Crop is based on texture (must use texture width and height) */

	originalTextureRect = new Phaser.Rectangle(0, 0, this.sprite.texture.width, this.sprite.texture.height);
	/* Saved original texture rect because crop will modify texture properties */
	this.sprite.crop(new Phaser.Rectangle(0, 0, this.sprite.texture.width, this.sprite.texture.height), false);
}

SpriteComponent.prototype.update = function() {
	var transform = this.owner.components.get("physics").getTransform();
	this.sprite.position.x = transform.position.x;
	this.sprite.position.y = transform.position.y;
	this.sprite.angle = transform.angle;
}

SpriteComponent.prototype.getHeight = function() {
	return this.sprite.height;
}

SpriteComponent.prototype.getWidth = function() {
	return this.sprite.width;
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

SpriteComponent.prototype.cropHorizontally = function(percentage) {
	this.sprite.cropRect.width = originalTextureRect.width*percentage;
	this.sprite.updateCrop();
}

module.exports = SpriteComponent;