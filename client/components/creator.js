'use strict'

var BaseComponent = require('../../shared/core/component.js');
var ProjectileFactory= require('../core/projectile_factory.js');

function CreatorComponent() {
	// console.log("inside CreatorComponent constr");
	this.key = "creator";
	this.temporaryEntitiesIDs = [];
}

///
CreatorComponent.prototype = Object.create(BaseComponent.prototype);
CreatorComponent.prototype.constructor = CreatorComponent;
///

// CreatorComponent.prototype.createBullet = function(cannonPosition, angle) {
// 	// console.log("CreatorComponent createBullet");
//     var bullet = ProjectileFactory.createBullet(this.owner, cannonPosition, angle);
//     // console.log(bullet);
//     this.temporaryEntitiesIDs.push(bullet.id);
//     // console.log("CreateBullet", this.temporaryEntitiesIDs);
//     return bullet;
// }

CreatorComponent.prototype.getTempEntities = function() {
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
}

module.exports = CreatorComponent;
