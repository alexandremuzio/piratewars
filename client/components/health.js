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
	this.owner.on('entity.die', this.onEntityDie.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
}

HealthComponent.prototype.update = function() {
	if(this.currentHealth <= 0 && this.alive == true) {
		this.owner.die();
	}	
}

HealthComponent.prototype.onEntityDie = function() {
	this.alive = false;
}

HealthComponent.prototype.onEntityRevive = function() {
	this.alive = true;
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