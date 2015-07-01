'use strict'

var BaseComponent = require('../../shared/components/mine_generator.js');
var ProjectileFactory = require('../core/projectile_factory.js');

var mine_settings = require('../../shared/settings/mine.json');

function MineGenerator() {
	BaseComponent.call(this);
};

///
MineGenerator.prototype = Object.create(BaseComponent.prototype);
MineGenerator.prototype.constructor = MineGenerator;
///

MineGenerator.prototype.getId = function() {
	return this.getFirstAvailableID();
}

MineGenerator.prototype.createMine = function(mineId, minePosition, mineAngle, mineVelocity) {
	ProjectileFactory.createMine(mineId, minePosition, mineAngle, mineVelocity)
}

MineGenerator.prototype.getFirstAvailableID = function() {
	if (this.temporaryEntitiesIDs.length === 0) {
		console.log("ERROR: tried to get id from empty array (package loss)");		
	}
	else {		
		return this.temporaryEntitiesIDs.shift();
	}
}

// MineGenerator.prototype.update = function(){ 
// 	if( !this.owner.subentityManager.hasSubentity() )
// 		this.owner.destroy();
// }

module.exports = MineGenerator;