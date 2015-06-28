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
};

HealthBarComponent.prototype.update = function() {
	var currentHealth = this.owner.baseEntity.components.get("health").currentHealth;
	var maxHealth = this.owner.baseEntity.components.get("health").maxHealth;

    this._percentage = currentHealth / maxHealth;
	this.owner.components.get("sprite").cropImage('blood', this._percentage);
};

module.exports = HealthBarComponent;