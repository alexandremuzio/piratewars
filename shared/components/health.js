'use strict'

var GameComponent = require('../../shared/core/component.js');

function LifeComponent(maxHealth) {
	this.key = "health";
	this.currentHealth = maxHealth;
	this.maxHealth = maxHealth;
	this.alive = true;
};

///
LifeComponent.prototype = Object.create(GameComponent.prototype);
LifeComponent.prototype.constructor = LifeComponent;
///

module.exports = LifeComponent;