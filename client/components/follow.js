'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');

function FollowComponent(sprite) {
	console.log("inside followComp constr");
	this.key = "follow";
	this.followSprite = sprite;
};

///
FollowComponent.prototype = Object.create(GameComponent.prototype);
FollowComponent.prototype.constructor = FollowComponent;
///

FollowComponent.prototype.init = function() {
};

FollowComponent.prototype.update = function() {

	/////////////////  IMPROVE THIS ///////////////////
	var transform = this.owner.components.get("physics").getTransform();
	transform.position = {x: transform.position.x + this.followSprite.deltaX, y: transform.position.y + this.followSprite.deltaY};
	///////////////////////////////////////////////////

	this.owner.components.get("physics").setTransform(transform);
}

module.exports = FollowComponent;