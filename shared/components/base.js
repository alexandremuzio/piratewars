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

}

BaseComponent.prototype.update = function() {}

module.exports = BaseComponent;