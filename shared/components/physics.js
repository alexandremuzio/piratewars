'use strict'

var GameEngine = require('../game_engine.js');
var GameComponent = require('../core/component.js');

function PhysicsComponent(body) {
	console.log("inside physicsComp constr");
	this.key = "physics";
	this.body = body;
	GameEngine.getInstance().world.addBody(this.body);
};

///
PhysicsComponent.prototype = Object.create(GameComponent.prototype);
PhysicsComponent.prototype.constructor = PhysicsComponent;
///

PhysicsComponent.prototype.update = function() {
	// this.owner.transform.position = {x: this.body.position[0], y: this.body.position[1]};
	// this.owner.transform.angle = this.body.angle;
}

module.exports = PhysicsComponent;