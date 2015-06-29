'use strict'

var BaseComponent = require('../../shared/components/health');

function HealthComponent(value) {
	BaseComponent.call(this, value);
};

///
HealthComponent.prototype = Object.create(BaseComponent.prototype);
HealthComponent.prototype.constructor = HealthComponent;
///

HealthComponent.prototype.init = function() {
}

HealthComponent.prototype.getHealth = function() {
	return this.currentHealth;
}

HealthComponent.prototype.getMaxHealth = function() {
	return this.maxHealth;
}

HealthComponent.prototype.setHealth = function(newHealth) {
	this.currentHealth = newHealth;
}
module.exports = HealthComponent;