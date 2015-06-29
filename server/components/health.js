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
}

LifeComponent.prototype.update = function() {
	if(this.currentHealth <= 0) {
		// console.log("Entity died");
	}
		// this.owner.die();
}

LifeComponent.prototype.die = function() {
}

LifeComponent.prototype.onEntityDamage = function(value) {
	this.currentHealth -= value;
	// console.log( this.owner.key + " has been damaged by " + value);
	if(this.currentHealth < 0) this.currentHealth = 0;
}
module.exports = LifeComponent;