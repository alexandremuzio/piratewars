'use strict'

var BaseComponent = require('../../shared/components/bullet');
var GameEngine = require('../../shared/game_engine');

var bullet_settings = require('../../shared/settings/bullet.json');

function BulletComponent() {
	BaseComponent.apply(this);
	this.sent = false;

	this.bulletDamage = bullet_settings.damage;
}

///
BulletComponent.prototype = Object.create(BaseComponent.prototype);
BulletComponent.prototype.constructor = BulletComponent;
///

BulletComponent.prototype.init = function() {
	this.currentTime = new Date();
	// this.createCollisionHandler();
}

BulletComponent.prototype.update = function() {
	var newCurrentTime = new Date();
	this.currentAliveTime += (newCurrentTime - this.currentTime);
	this.currentTime = newCurrentTime;

	if (this.currentAliveTime >= this.bulletSurvivalTime) {
		//delete bullet some way
		// console.log("Bullet should be deleted now!");
		this.owner.destroy();
	}
	// console.log(this.owner.components.get("physics").body.position);
};

module.exports = BulletComponent;