'use strict'

var _ = require('underscore');
var BaseComponent = require('../../shared/components/cannons_manager_controller.js');
var UUID = require('node-uuid');

function CannonsManagerController() {
	BaseComponent.apply(this);
	this.temporaryEntitiesIDs = [];
};

///
CannonsManagerController.prototype = Object.create(BaseComponent.prototype);
CannonsManagerController.prototype.constructor = CannonsManagerController;
///

CannonsManagerController.prototype.update = function() {
}

CannonsManagerController.prototype.shootLeft = function() {
	_.each(this.leftCannons, function(cannon) {
		var id = this.getFirstAvailableID();
		var bullet = cannon.components.get('cannon_controller').shoot(id);
	}.bind(this));
}

CannonsManagerController.prototype.shootRight = function() {
	_.each(this.rightCannons, function(cannon) {
		var id = this.getFirstAvailableID();
		var bullet = cannon.components.get('cannon_controller').shoot(id);
	}.bind(this));
}

CannonsManagerController.prototype.getFirstAvailableID = function() {
	// console.log(this.owner.id);
	if (this.temporaryEntitiesIDs.length === 0) {
		// console.log("ERROR: tried to get id from empty array (package loss)");
		var uuid = new UUID();
		return this.owner.id + '*' + uuid;
	}
	else {		
		return this.temporaryEntitiesIDs.shift();
	}
}

module.exports = CannonsManagerController;