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

LifeComponent.prototype.getHealth = function() {
	return this.currentHealth;
}

LifeComponent.prototype.getMaxHealth = function() {
	return this.maxHealth;
}

LifeComponent.prototype.setHealth = function(newHealth) {
	this.currentHealth = newHealth;
}
module.exports = LifeComponent;