'use strict'

var BaseComponent = require('../../shared/components/health');

function HealthComponent(maxHealth) {
	BaseComponent.call(this, maxHealth);
};

///
HealthComponent.prototype = Object.create(BaseComponent.prototype);
HealthComponent.prototype.constructor = HealthComponent;
///

HealthComponent.prototype.init = function() {
	this.owner.on('entity.damage', this.onEntityDamage.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
	this.owner.on('entity.die', this.onEntityDie.bind(this));
}

HealthComponent.prototype.update = function() {
	if(this.currentHealth <= 0 && this.alive == true) {
		this.owner.die();
	}
	if(this.currentHealth > 0 && this.alive == false) {
		this.owner.revive();
	}
}

HealthComponent.prototype.onEntityDie = function() {
	this.alive = false;
}

HealthComponent.prototype.onEntityDamage = function(value) {
	this.currentHealth -= value;
	// console.log( this.owner.key + " has been damaged by " + value);
	if(this.currentHealth < 0) this.currentHealth = 0;
}

HealthComponent.prototype.onEntityRevive = function() {
	this.currentHealth = this.maxHealth;
	this.alive = true;
}

module.exports = HealthComponent;