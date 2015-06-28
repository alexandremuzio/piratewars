'use strict'

var GameComponent = require('../../shared/core/component.js');

function LifeComponent(value) {
	this.key = "life";
	this._value = value;
	this._maxValue = value;
};

///
LifeComponent.prototype = Object.create(GameComponent.prototype);
LifeComponent.prototype.constructor = LifeComponent;
///

LifeComponent.prototype.init = function() {
}

LifeComponent.prototype.getLife = function() {
	return this._value;
}

LifeComponent.prototype.getMaxLife = function() {
	return this._maxValue;
}

LifeComponent.prototype.setLife = function(value) {
	this._value = value;
}
module.exports = LifeComponent;