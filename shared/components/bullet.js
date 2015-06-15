'use strict'

var GameComponent = require('../core/component');
var GameEngine = require('../game_engine');

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

module.exports = BulletComponent;