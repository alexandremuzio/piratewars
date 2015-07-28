'use strict';

var BaseComponent = require('../core/component.js');

function CannonsManagerController() {
	this.key = 'cannons_manager_controller';
	this.leftCannons = [];
	this.rightCannons = [];
}

///
CannonsManagerController.prototype = Object.create(BaseComponent.prototype);
CannonsManagerController.prototype.constructor = CannonsManagerController;
///

CannonsManagerController.prototype.update = function () {
};

CannonsManagerController.prototype.addLeft = function (cannon) {
	this.leftCannons.push(cannon);
};

CannonsManagerController.prototype.addRight = function (cannon) {
	this.rightCannons.push(cannon);
};

module.exports = CannonsManagerController;