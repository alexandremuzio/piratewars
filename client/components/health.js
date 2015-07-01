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
	this.owner.on('entity.die', this.onEntityDie.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
}

LifeComponent.prototype.update = function() {
	if(this.currentHealth <= 0 && this.alive == true) {
		this.owner.die();
	}
	else if(this.currentHealth > 0 && this.alive == false) {
		this.owner.revive();
	}
}

LifeComponent.prototype.onEntityDie = function() {
	this.alive = false;
}

LifeComponent.prototype.onEntityRevive = function() {
	this.alive = true;
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