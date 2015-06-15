'use strict'

var _ = require('underscore');
var ComponentBase = require('../core/component');
var MathUtils = require('../utils/math')

function CannonComponent() {
	this.key = 'cannon';
};

///
CannonComponent.prototype = Object.create(ComponentBase.prototype);
CannonComponent.prototype.constructor = CannonComponent;
///

CannonComponent.prototype.update = function() {
	var body = this.owner.components.get("physics").body;
	var rectangle = body.shapes[0];

	var leftAngle = body.angle - 90;
	var rightAngle = body.angle + 90;

	var leftVector = MathUtils.vector(rectangle.height/1.5, leftAngle);
	var rightVector = MathUtils.vector(rectangle.height/1.5, rightAngle);
	var paraVector = MathUtils.vector(rectangle.width/4,body.angle);

	//update Cannon positions
	this.leftCannons = [
		{
			x: body.position[0] + leftVector.x,
			y: body.position[1] + leftVector.y
		},
		{
			x: body.position[0] - paraVector.x + leftVector.x,
			y: body.position[1] - paraVector.y+ leftVector.y
		},
		{
			x: body.position[0] +paraVector.x + leftVector.x,
			y: body.position[1] +paraVector.y+ leftVector.y
		}

	];

	this.rightCannons = [
		{
			x: body.position[0] + rightVector.x,
			y: body.position[1] + rightVector.y
		},
		{
			x: body.position[0] - paraVector.x + rightVector.x,
			y: body.position[1] - paraVector.y+ rightVector.y
		},
		{
			x: body.position[0] + paraVector.x + rightVector.x,
			y: body.position[1] + paraVector.y+ rightVector.y
		}

	];

}

CannonComponent.prototype.shootLeftCannons = function() {
	var creator = this.owner.components.get("creator");
	_.each(this.leftCannons, function(cannon) {
    	creator.createBullet(cannon, "left");
	});
}

CannonComponent.prototype.shootRightCannons = function() {
	var creator = this.owner.components.get("creator");
    _.each(this.rightCannons, function(cannon) {
    	creator.createBullet(cannon, "right");
	});
}

module.exports = CannonComponent;