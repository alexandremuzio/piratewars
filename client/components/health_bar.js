'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');
//Private
var playerMaxLife;
var playerReference;


function HealthBarComponent(player) {
	console.log("inside HealthBarComponent constr");
	this.key = 'healthBar';
	playerReference = player;
}

HealthBarComponent.prototype = Object.create(GameComponent.prototype);
HealthBarComponent.prototype.constructor = HealthBarComponent;

HealthBarComponent.prototype.init = function() {
	//Delete this
	this.tick = 0;
	this.percentege = 1.0;
};

HealthBarComponent.prototype.update = function() {
	this.tick++;
	if(this.tick > 100) {
		///////////////
		this.percentege -= 0.05;
		if(this.percentege < 0) this.percentege = 1.0;
		this.tick = 0;
		//////////////

		this.owner.components.get("sprite").cropHorizontally(this.percentege); //Change to playerLife/MaxLife
	}
};

module.exports = HealthBarComponent;