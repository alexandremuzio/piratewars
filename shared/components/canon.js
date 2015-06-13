'use strict'

var _ = require('underscore');
var MathUtils = require('../utils/math')
var ComponentBase = require('../core/component');

function CanonComponent(player) {
	this.key = 'canon';
};

///
CanonComponent.prototype = Object.create(ComponentBase.prototype);
CanonComponent.prototype.constructor = CanonComponent;
///

CanonComponent.prototype.update = function() {
	var body = this.owner.components.get("physics").body;
	var rectangle = body.shapes[0];

	var leftAngle = body.angle - 90;
	var rightAngle = body.angle + 90;

	var leftVector = MathUtils.vector(rectangle.height/1.5, leftAngle);
	var rightVector = MathUtils.vector(rectangle.height/1.5, rightAngle);
	var paraVector = MathUtils.vector(rectangle.width/4,body.angle);

	//update canon positions
	this.leftCanons = [
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

	this.rightCanons = [
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

CanonComponent.prototype.shootLeftCanons = function() {
	var creator = this.owner.components.get("creator");
	_.each(this.leftCanons, function(canon) {
    	creator.createBullet(canon, "left");
	});
}

CanonComponent.prototype.shootRightCanons = function() {
	var creator = this.owner.components.get("creator");
    _.each(this.rightCanons, function(canon) {
    	creator.createBullet(canon, "right");
	});
}

module.exports = CanonComponent;