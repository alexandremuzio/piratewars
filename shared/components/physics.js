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

PhysicsComponent.prototype.update = function() {

}

PhysicsComponent.prototype.onEntityDestroy = function() {
	GameEngine.getInstance().world.removeBody(this.body);
}

module.exports = PhysicsComponent;