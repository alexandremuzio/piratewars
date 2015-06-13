'use strict'

var BaseComponent = require('../../shared/core/component.js');
var EntityCreator= require('../core/entity_creator.js');

function CreatorComponent() {
	console.log("inside CreatorComponent constr");
	this.key = "creator";
	// console.log("EntityFactory= ", EntityFactory);
}

///
CreatorComponent.prototype = Object.create(BaseComponent.prototype);
CreatorComponent.prototype.constructor = CreatorComponent;
///

CreatorComponent.prototype.createBullet = function(side) {
	console.log("CreatorComponent createBullet");
    var bullet = EntityCreator.createBullet(this.owner,side);
    // console.log(bullet);
    return bullet;
}

module.exports = CreatorComponent;
