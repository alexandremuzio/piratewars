'use strict'

var BaseComponent = require('../../shared/components/health');

function LifeComponent(value) {
	BaseComponent.call(this, value);
};

///
LifeComponent.prototype = Object.create(BaseComponent.prototype);
LifeComponent.prototype.constructor = LifeComponent;
///

LifeComponent.prototype.init = function() {
}

LifeComponent.prototype.getLife = function() {
	return this._value;
}

LifeComponent.prototype.getMaxLife = function() {
	return this._maxHealth;
}

LifeComponent.prototype.setLife = function(value) {
	this._value = value;
}
module.exports = LifeComponent;