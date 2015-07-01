'use strict'

var GameComponent = require('../../shared/core/component.js');

function HealthComponent(maxHealth) {
	this.key = "health";
	this.currentHealth = maxHealth;
	this.maxHealth = maxHealth;
	this.alive = true;
};

///
HealthComponent.prototype = Object.create(GameComponent.prototype);
HealthComponent.prototype.constructor = HealthComponent;
///

module.exports = HealthComponent;
