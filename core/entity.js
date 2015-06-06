'use strict'

var GameComponent = require('./game_component.js');
var GameEngine = require('./game_engine.js');
var ComponentManager = require('./component_manager.js');
var Transform = require('./transform.js');

function Entity() {
	console.log("inside entity constr");
	console.log(this);
	GameEngine.getInstance().addEntity(this);
	this.transform = new Transform();
	this.components = new ComponentManager(this);
};

///
Entity.prototype = Object.create(GameComponent.prototype);
Entity.prototype.constructor = Entity;
///

// Entity.prototype.components = new ComponentManager(this);

/**
 * @override
 */
Entity.prototype.update = function() {
	this.components.update();
}

module.exports = Entity;