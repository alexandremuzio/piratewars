'use strict';

var _ = require('underscore');
var BaseComponent = require('../../shared/components/cannon_controller');
var ProjectileFactory = require('../core/projectile_factory.js');

function CannonController(baseEntity) {
    BaseComponent.call(this);
}

///
CannonController.prototype = Object.create(BaseComponent.prototype);
CannonController.prototype.constructor = CannonController;
///

CannonController.prototype.shoot = function () {
	if (_.isUndefined(this._sound))
		this._sound = this.owner.baseEntity.baseEntity.components.get('sound');
		
	this._sound.play('canon');
	
	var bulletStartTransform = this.owner.subentityManager.get('bullet_start').transform;
	var velocity = this.owner.baseEntity.baseEntity.components.get('physics').body.velocity;
	return ProjectileFactory.createBullet(bulletStartTransform.getPosition(),
		velocity,
		bulletStartTransform.getAngle());
};

module.exports = CannonController;