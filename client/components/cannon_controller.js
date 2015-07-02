'use strict'

var _ = require('underscore');
var BaseComponent = require('../../shared/components/cannon_controller');
var ProjectileFactory = require('../core/projectile_factory.js');

function CannonController() {
	// Call base constructor  
    BaseComponent.call(this);
    this._countId = 0;
};

///
CannonController.prototype = Object.create(BaseComponent.prototype);
CannonController.prototype.constructor = CannonController;
///

CannonController.prototype.shoot = function() {
    // console.log(this.owner.subentityManager.get('bullet_start'));

	var bulletStartTransform = this.owner.subentityManager.get('bullet_start').transform;
	var velocity = this.owner.baseEntity.baseEntity.components.get('physics').body.velocity;
	return ProjectileFactory.createBullet(this.owner.id+'-bullet_'+(this._countId++), 
										  bulletStartTransform.getPosition(),
										  velocity,
										  bulletStartTransform.getAngle());
}

module.exports = CannonController;