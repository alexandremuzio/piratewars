'use strict'

var GameComponent = require('../core/component.js');


///////////////////// Send these to a data file /////////////////////////////
var bulletSurvivalTime = 2000;

function BulletComponent() {
	this.key = "bullet";

	this.bulletSurvivalTime = bulletSurvivalTime;
	this.currentAliveTime = 0;
}

///
BulletComponent.prototype = Object.create(GameComponent.prototype);
BulletComponent.prototype.constructor = BulletComponent;
///

BulletComponent.prototype.init = function() {
	this.currentTime = new Date();
}

BulletComponent.prototype.update = function() {
	var newCurrentTime = new Date();
	this.currentAliveTime += (newCurrentTime - this.currentTime);
	this.currentTime =  newCurrentTime;

	if (this.currentAliveTime >= this.bulletSurvivalTime) {
		//delete bullet some way
		// console.log("Bullet should be deleted now!");
	}
};

module.exports = BulletComponent;