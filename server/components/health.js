'use strict'

var BaseComponent = require('../../shared/components/health.js');

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
	if(this.currentLife <= 0) {
		// console.log("Entity died");
	}
		// this.owner.die();
}

LifeComponent.prototype.die = function() {
}

LifeComponent.prototype.onEntityDamage = function(value) {
	this.currentLife -= value;
	console.log( this.owner.key + " has been damaged by " + value);
	if(this.currentLife < 0) this.currentLife = 0;
}
module.exports = LifeComponent;