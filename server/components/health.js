'use strict'

var BaseComponent = require('../../shared/components/health');

function LifeComponent(maxHealth) {
	BaseComponent.call(this, maxHealth);
};

///
LifeComponent.prototype = Object.create(BaseComponent.prototype);
LifeComponent.prototype.constructor = LifeComponent;
///
LifeComponent.prototype.init = function() {
	this.owner.on('entity.damage', this.onEntityDamage.bind(this));
	this.owner.on('entity.revive', this.onEntityRevive.bind(this));
	this.owner.on('entity.die', this.onEntityDie.bind(this));
}

LifeComponent.prototype.update = function() {
	if(this.currentHealth <= 0 && this.alive == true) {
		this.owner.die();
	}
	if(this.currentHealth > 0 && this.alive == false) {
		this.owner.revive();
	}
}

LifeComponent.prototype.onEntityDie = function() {
	this.alive = false;
}

LifeComponent.prototype.onEntityDamage = function(value) {
	this.currentHealth -= value;
	// console.log( this.owner.key + " has been damaged by " + value);
	if(this.currentHealth < 0) this.currentHealth = 0;
}

LifeComponent.prototype.onEntityRevive = function() {
	this.currentHealth = this.maxHealth;
	this.alive = true;
}

module.exports = LifeComponent;