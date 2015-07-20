'use strict';

var BaseComponent = require('../../shared/components/cannon_controller');
var ProjectileFactory = require('../core/projectile_factory.js');

function CannonController() {
	// Call base constructor  
    BaseComponent.call(this);
}

///
CannonController.prototype = Object.create(BaseComponent.prototype);
CannonController.prototype.constructor = CannonController;
///

CannonController.prototype.shoot = function(id) {
	// console.log(this.owner.subentityManager.get('bullet_start'));
	var bulletStartTransform = this.owner.subentityManager.get('bullet_start').transform;
	var velocity = this.owner.baseEntity.baseEntity.components.get('physics').body.velocity;
	ProjectileFactory.createBullet(bulletStartTransform.getPosition(),
								   velocity,
								   bulletStartTransform.getAngle(),
								   id);
};

module.exports = CannonController;