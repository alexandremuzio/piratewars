'use strict'

var GameEngine = require('../game_engine.js');
var GameComponent = require('../core/component.js');

function PhysicsComponent(body) {
	// console.log("inside physicsComp constr");
	this.key = "physics";
	this.body = body;
	GameEngine.getInstance().world.addBody(this.body);
};

///
PhysicsComponent.prototype = Object.create(GameComponent.prototype);
PhysicsComponent.prototype.constructor = PhysicsComponent;
///

PhysicsComponent.prototype.init = function() {
	this.owner.on('entity.destroy', this.onEntityDestroy.bind(this));
}

PhysicsComponent.prototype.update = function() {}

PhysicsComponent.prototype.getTransform = function() {

	/////////////////  IMPROVE THIS ///////////////////
	var transform = {};
	transform.position = {x: this.body.position[0], y: this.body.position[1]};
	transform.velocity = {x: this.body.velocity[0], y: this.body.velocity[1]};
	transform.angle = this.body.angle;
	return transform;
	///////////////////////////////////////////////////
}

PhysicsComponent.prototype.setTransform = function(transform) {
	this.body.position = [transform.position.x, transform.position.y];
	this.body.velocity = [transform.velocity.x, transform.velocity.y];
	this.body.angle = transform.angle;
	// console.log("body position x= ", this.body.position[0]);
}

PhysicsComponent.prototype.onEntityDestroy = function() {
	GameEngine.getInstance().world.removeBody(this.body);
}

PhysicsComponent.prototype.getDeltaX = function() {
	return this.body.deltaX;
};


PhysicsComponent.prototype.getDeltaY = function() {
	return this.body.deltaY;
};

module.exports = PhysicsComponent;