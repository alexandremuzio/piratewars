'use strict'

var GameEngine = require('../game_engine.js');
var GameComponent = require('../core/component.js');

function BaseComponent(body) {
	this.key = "base";
	this.body = body;
};

///
BaseComponent.prototype = Object.create(GameComponent.prototype);
BaseComponent.prototype.constructor = BaseComponent;
///

BaseComponent.prototype.init = function() {
	this.owner.on('entity.die', this.onBaseDie.bind(this));
}

BaseComponent.prototype.update = function() {}

BaseComponent.prototype.onBaseDie = function() {
	// What happens when base dies
}

module.exports = BaseComponent;