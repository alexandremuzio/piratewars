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
	this_.tick = 0;//Just for tests
}

//Update just for tests
LifeComponent.prototype.update = function() {
	this._tick++;
	if(this._tick > 200) {
		this._value -= 0.2*this._maxValue;
		this._tick = 0;
		if(this._value < 0) this._value = 0;
	}
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