'use strict'

var GameEngine = require('../game_engine.js');
var GameComponent = require('../core/component.js');

//Private variables
var followComponent;

function FollowComponent(component) {
	console.log("inside followComp constr");
	this.key = "follow";
	followComponent = component;
};

///
FollowComponent.prototype = Object.create(GameComponent.prototype);
FollowComponent.prototype.constructor = FollowComponent;
///

FollowComponent.prototype.init = function() {};

FollowComponent.prototype.update = function() {

	/////////////////  IMPROVE THIS ///////////////////
	var transform = this.owner.components.get("physics").getTransform();
	transform.position = {x: transform[0] + followComponent.deltaX, y: transform[1] + followComponent.deltaY};
	///////////////////////////////////////////////////

	this.owner.components.get("physics").setTransform(transform);
}

module.exports = FollowComponent;