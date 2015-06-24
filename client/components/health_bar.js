'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');

function HealthBarComponent() {
	console.log("inside HealthBarComponent constr");
	this.key = 'health_bar';
}

HealthBarComponent.prototype = Object.create(GameComponent.prototype);
HealthBarComponent.prototype.constructor = HealthBarComponent;

HealthBarComponent.prototype.init = function() {
	//Delete this
	this.tick = 0;
	this.percentage = 1.0;
};

HealthBarComponent.prototype.update = function() {
	var currentHealth = this.owner.baseEntity.baseEntity.components.get("health").currentHealth;
	var maxHealth = this.owner.baseEntity.baseEntity.components.get("health").maxHealth;

	this.percentage = currentHealth / maxHealth;

	this.owner.components.get("sprite").cropHorizontally(this.percentage);
};

module.exports = HealthBarComponent;