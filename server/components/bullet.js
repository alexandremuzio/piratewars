'use strict';

var BaseComponent = require('../../shared/components/bullet');

var bullet_settings = require('../../shared/settings/bullet.json');

function BulletComponent() {
	BaseComponent.apply(this);
	this.sent = false;

	this.damage = bullet_settings.damage;
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
	// console.log(this.owner.components.get('physics').body.position);
};

BulletComponent.prototype.onCollision = function (collider) {
	if (collider.key == 'player') {
		collider.damage(this.damage, collider);
		console.log('damaging player!');
	}

	if (collider.key == 'stronghold') {
		collider.damage(this.damage, collider);
		console.log('damaging stronghold!');
	}

	//kill bullet after collision
	this.owner.destroy();
};

module.exports = BulletComponent;