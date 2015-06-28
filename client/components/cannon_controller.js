'use strict'

var _ = require('underscore');
var ComponentBase = require('../../shared/core/component');
var BulletFactory = require('../core/bullet_factory.js');

function CannonController() {
	this.key = 'cannon_controller';
};

///
CannonController.prototype = Object.create(ComponentBase.prototype);
CannonController.prototype.constructor = CannonController;
///

CannonController.prototype.update = function() {
}

CannonController.prototype.shoot = function() {
	// console.log(this.owner.childrenManager.getChild('bullet_start'));
	var bulletStartTransform = this.owner.childrenManager.getChild('bullet_start').transform;
	BulletFactory.createBullet(bulletStartTransform.getPosition(), bulletStartTransform.getAngle());
}

module.exports = CannonController;