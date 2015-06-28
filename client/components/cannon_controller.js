'use strict'

var _ = require('underscore');
var CannonController = require('../../shared/components/cannon_controller');
var BulletFactory = require('../core/bullet_factory.js');

function CannonController() {
	// Call base constructor  
    CannonController.call(this);
};

///
CannonController.prototype = Object.create(CannonController.prototype);
CannonController.prototype.constructor = CannonController;
///

CannonController.prototype.shoot = function() {
	// console.log(this.owner.subentityManager.get('bullet_start'));
	var bulletStartTransform = this.owner.subentityManager.get('bullet_start').transform;
	return BulletFactory.createBullet(bulletStartTransform.getPosition(), bulletStartTransform.getAngle());
}

module.exports = CannonController;