'use strict'

var _ = require('underscore');
var ComponentBase = require('../../shared/core/component');

function CannonsManagerController() {
	this.key = 'cannons_manager_controller';
	this.leftCannons = [];
	this.rightCannons = [];
};

///
CannonsManagerController.prototype = Object.create(ComponentBase.prototype);
CannonsManagerController.prototype.constructor = CannonsManagerController;
///

CannonsManagerController.prototype.update = function() {
}

CannonsManagerController.prototype.addLeft = function(cannon) {
	this.leftCannons.push(cannon);
}

CannonsManagerController.prototype.shootLeft = function() {
	_.each(this.leftCannons, function(cannon) {
    	cannon.components.get('cannon_controller').shoot();
	});
}

CannonsManagerController.prototype.addRight = function(cannon) {
	this.rightCannons.push(cannon);
}

CannonsManagerController.prototype.shootRight = function() {
	_.each(this.rightCannons, function(cannon) {
    	cannon.components.get('cannon_controller').shoot();
	});
}

module.exports = CannonsManagerController;