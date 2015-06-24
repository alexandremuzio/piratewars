'use strict'

var GameEngine = require('../game_engine.js');
var GameComponent = require('../core/component.js');

function LifeComponent(value) {
	this.key = "life";
	this._maxLife = value;
};

///
LifeComponent.prototype = Object.create(GameComponent.prototype);
LifeComponent.prototype.constructor = LifeComponent;
///

LifeComponent.prototype.init = function() {
	this._currentLife = this._maxLife;
}

LifeComponent.prototype.update = function() {}

LifeComponent.prototype.damage = function() {
	
}
module.exports = LifeComponent;