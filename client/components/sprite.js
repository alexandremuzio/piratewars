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
	this.owner.on('entity.destroy', this.onEntityDestroy.bind(this));	/* Crop is based on texture (must use texture width and height) */

	this.originalTextureRect = new Phaser.Rectangle(0, 0, this.sprite.texture.width, this.sprite.texture.height);
	/* Saved original texture rect because crop will modify texture properties */
	this.sprite.crop(new Phaser.Rectangle(0, 0, this.sprite.texture.width, this.sprite.texture.height), false);
}

SpriteComponent.prototype.update = function() {
	// MPTest
	if( this.owner.key != 'test' ){
		var transform = this.owner.transform.getTransform();
		if( typeof transform.position.x === 'number' && typeof transform.position.y === 'number' && typeof transform.angle === 'number' ){
			this.sprite.position.x = transform.position.x;
			this.sprite.position.y = transform.position.y;
			this.sprite.angle = transform.angle;
		}
	}
	else{
		var transform = this.owner.transform.getTransform();
		// console.log("transform.position.x = " + transform.position.x);
		// console.log("transform.position.y = " + transform.position.y);
		// console.log("transform.angle = " + transform.angle);
		if( typeof transform.position.x === 'number' && typeof transform.position.y === 'number' && typeof transform.angle === 'number' ){
			this.sprite.position.x = transform.position.x;
			this.sprite.position.y = transform.position.y;
			this.sprite.angle = transform.angle;
		}
	}
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
	this.sprite.cropRect.width = this.originalTextureRect.width*percentage;
	this.sprite.updateCrop();
}

module.exports = SpriteComponent;