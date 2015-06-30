'use strict'

var _ = require('underscore');
var BaseComponent = require('../../shared/components/cannon_controller');
var ProjectileFactory = require('../core/projectile_factory.js');

function CannonController() {
	// Call base constructor  
    BaseComponent.call(this);
};

///
CannonController.prototype = Object.create(BaseComponent.prototype);
CannonController.prototype.constructor = CannonController;
///

CannonController.prototype.shoot = function() {
    // console.log(this.owner.subentityManager.get('bullet_start'));

	var bulletStartTransform = this.owner.subentityManager.get('bullet_start').transform;
	return ProjectileFactory.createBullet(bulletStartTransform.getPosition(), bulletStartTransform.getAngle());
}

module.exports = CannonController;