'use strict';

var BaseComponent = require('../../shared/components/bullet');

function BulletComponent() {
	BaseComponent.apply(this);
}

///
BulletComponent.prototype = Object.create(BaseComponent.prototype);
BulletComponent.prototype.constructor = BulletComponent;
///

BulletComponent.prototype.init = function () {
	this.currentTime = new Date();
	this.owner.on('entity.collision', this.onCollision.bind(this));
};

BulletComponent.prototype.update = function () {
	var newCurrentTime = new Date();
	this.currentAliveTime += (newCurrentTime - this.currentTime);
	this.currentTime = newCurrentTime;


	if (this.currentAliveTime >= this.bulletSurvivalTime) {
		//delete bullet some way
		// console.log('Bullet should be deleted now!');
		this.owner.destroy();
	}
};

BulletComponent.prototype.onCollision = function (collider) {
	//kill bullet after collision
	this.owner.destroy();
};

module.exports = BulletComponent;