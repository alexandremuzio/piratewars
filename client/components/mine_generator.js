'use strict';

var BaseComponent = require('../../shared/components/mine_generator.js');
var ProjectileFactory = require('../core/projectile_factory.js');

// var mine_settings = require('../../shared/settings/mine.json');

function MineGenerator() {
	BaseComponent.call(this);
}

///
MineGenerator.prototype = Object.create(BaseComponent.prototype);
MineGenerator.prototype.constructor = MineGenerator;
///

MineGenerator.prototype.getId = function () {
	return this.owner.id + '-mine_' + this._idCount++;
};

MineGenerator.prototype.createMine = function (mineId, mineKey, minePosition, mineAngle, mineVelocity) {
	return ProjectileFactory.createMine(mineId, mineKey, minePosition, mineAngle, mineVelocity);
};

MineGenerator.prototype.getTempEntities = function () {
	if (this.temporaryEntitiesIDs.length > 0) {
		// Cloning array before emptying it
		var tempEntities = this.temporaryEntitiesIDs.slice(0);
		this.temporaryEntitiesIDs = [];
		// console.log('GetTemp: this.tempEntities', this.temporaryEntitiesIDs);
		// console.log('GetTemp: var tempEntities', tempEntities);
		return tempEntities;
	}
	else {
		// console.log('Returning empty array');
		return [];
	}
};

// MineGenerator.prototype.update = function(){ 
// 	if( !this.owner.subentityManager.hasSubentity() )
// 		this.owner.destroy();
// }

module.exports = MineGenerator;