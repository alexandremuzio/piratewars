'use strict';

var _ = require('underscore');
var BaseComponent = require('../../shared/components/cannons_manager_controller.js');

function CannonsManagerController() {
	BaseComponent.apply(this);
	this.temporaryEntitiesIDs = [];
}

///
CannonsManagerController.prototype = Object.create(BaseComponent.prototype);
CannonsManagerController.prototype.constructor = CannonsManagerController;
///

CannonsManagerController.prototype.update = function() {
};

CannonsManagerController.prototype.shootLeft = function() {
	_.each(this.leftCannons, function(cannon) {
		var bullet = cannon.components.get('cannon_controller').shoot();
		this.temporaryEntitiesIDs.push(bullet.id);
	}.bind(this));
};

CannonsManagerController.prototype.shootRight = function() {
	_.each(this.rightCannons, function(cannon) {
		var bullet = cannon.components.get('cannon_controller').shoot();
		this.temporaryEntitiesIDs.push(bullet.id);
	}.bind(this));
};

CannonsManagerController.prototype.getTempEntities = function() {
	if (this.temporaryEntitiesIDs.length > 0) {
		// Cloning array before emptying it
		var tempEntities = this.temporaryEntitiesIDs.slice(0);
		this.temporaryEntitiesIDs = [];
    	// console.log("GetTemp: this.tempEntities", this.temporaryEntitiesIDs);
    	// console.log("GetTemp: var tempEntities", tempEntities);
		return tempEntities;
	}
	else {
		// console.log("Returning empty array");
		return [];
	}
};

module.exports = CannonsManagerController;