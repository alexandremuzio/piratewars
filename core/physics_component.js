'use strict'

var GameEngine = require('./game_engine.js');
var GameComponent = require('./game_component.js');

function PhysicsComponent(body) {
	console.log("inside physicsComp constr");
	this.body = body;
	GameEngine.getInstance().world.addBody(this.body);
};

///
PhysicsComponent.prototype = Object.create(GameComponent.prototype);
PhysicsComponent.prototype.constructor = PhysicsComponent;
///

PhysicsComponent.prototype.getBody = function() {
	console.log("inside getBody");
	return this.body;
}

module.exports = PhysicsComponent;