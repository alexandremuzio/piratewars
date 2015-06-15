'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');
//Private
var playerBody;
var playerHeight;
var playerMaxLife;
var originalSpriteWidth;
var playerReference;

//Delete this
var tick;
var percentege;

function HealthBarComponent(player) {
	console.log("inside HealthBarComponent constr");
	this.key = 'healthBar';
	playerReference = player;
}

HealthBarComponent.prototype = Object.create(GameComponent.prototype);
HealthBarComponent.prototype.constructor = HealthBarComponent;

HealthBarComponent.prototype.init = function() {
	playerBody = playerReference.components.get("physics").body;
	playerHeight = playerReference.components.get("sprite").getHeight();

	originalSpriteWidth = this.owner.components.get("sprite").getWidth();

	this.owner.components.get("sprite").setAnchor(0.0, 0.0);
	
	//Delete this
	tick = 0;
	percentege = 1.0;
};

HealthBarComponent.prototype.update = function() {
	var transform = {};
	transform.position = {x: playerBody.position[0] - originalSpriteWidth/2.0, y: playerBody.position[1] - 0.5*playerHeight};
	//transform.velocity = {x: playerBody.velocity[0], y: playerBody.velocity[1]};
	transform.angle = 0;
	
	tick++;
	if(tick > 100) {
		///////////////
		percentege -= 0.05;
		if(percentege < 0) percentege = 1.0;
		tick = 0;
		//////////////

		this.owner.components.get("sprite").cropHorizontally(percentege); //Change to playerLife/MaxLife
	}

	this.owner.components.get("physics").setTransform(transform);
};

module.exports = HealthBarComponent;