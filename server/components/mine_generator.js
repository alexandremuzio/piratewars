'use strict';

var BaseComponent = require('../../shared/components/mine_generator.js');
var ProjectileFactory = require('../core/projectile_factory.js');
var UUID = require('node-uuid');

// var mine_settings = require('../../shared/settings/mine.json');

function MineGenerator() {
	BaseComponent.call(this);
	this._mineCollisionManager = ProjectileFactory.createMineCollisionManager();
}

///
MineGenerator.prototype = Object.create(BaseComponent.prototype);
MineGenerator.prototype.constructor = MineGenerator;
///

MineGenerator.prototype.getId = function () {
	return this.getFirstAvailableID();
};

MineGenerator.prototype.createMine = function (mineId, mineKey, minePosition, mineAngle, mineVelocity) {
	return ProjectileFactory.createMine(mineId, mineKey, minePosition, mineAngle, mineVelocity, this._mineCollisionManager);
};

MineGenerator.prototype.getFirstAvailableID = function () {
	if (this.temporaryEntitiesIDs.length === 0) {
		console.log('ERROR: tried to get id from empty array (package loss)');
		var uuid = new UUID();
		return this.owner.id + '_' + uuid;
	}
	else {
		return this.temporaryEntitiesIDs.shift();
	}
};

// MineGenerator.prototype.update = function(){ 
// 	if( !this.owner.subentityManager.hasSubentity() )
// 		this.owner.destroy();
// }

module.exports = MineGenerator;