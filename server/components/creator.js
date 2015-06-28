'use strict'

var BaseComponent = require('../../shared/core/component.js');
var EntityCreator= require('../core/entity_creator.js');

function CreatorComponent() {
	// console.log("inside CreatorComponent constr");
	this.key = "creator";
	this.temporaryEntitiesIDs = [];
}

///
CreatorComponent.prototype = Object.create(BaseComponent.prototype);
CreatorComponent.prototype.constructor = CreatorComponent;
///

CreatorComponent.prototype.createBullet = function(canonPosition, side) {
	// console.log("CreatorComponent createBullet");
	var id = this.getFirstAvailableID();
    var bullet = EntityCreator.createBullet(this.owner, canonPosition, side, id);
    // console.log(bullet);   
    return bullet;
}

CreatorComponent.prototype.getFirstAvailableID = function() {
	if (this.temporaryEntitiesIDs.length === 0) {
		console.log("ERROR: tried to get id from empty array (package loss)");		
	}
	else {		
		return this.temporaryEntitiesIDs.shift();
	}
}

module.exports = CreatorComponent;
