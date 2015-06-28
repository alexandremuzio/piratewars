'use strict'

var GameComponent = require('../core/component');
var GameEngine = require('../game_engine');

var bullet_settings = require('../settings/bullet.json');


function BulletComponent() {
	this.key = "bullet";
	this.bulletSurvivalTime = bullet_settings.survival_time;
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