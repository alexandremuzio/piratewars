'use strict'

var GameComponent = require('./game_component.js');
var GameEngine = require('./game_engine.js');
var ComponentManager = require('./component_manager.js');

function Entity() {
	console.log("inside entity constr");
	GameEngine.getInstance().addEntity(this);
};

///
Entity.prototype = Object.create(GameComponent.prototype);
Entity.prototype.constructor = Entity;
///

Entity.prototype.components = new ComponentManager();

Entity.prototype.update = function() {
	components.update();
}

module.exports = Entity;