'use strict'

var BaseComponent = require('../../shared/core/component.js');
var EntityFactory = require('../core/entity_factory.js');

function CreatorComponent() {
	console.log("inside CreatorComponent constr");
	this.key = "creator";
	console.log("EntityFactory= ", EntityFactory);
}

///
CreatorComponent.prototype = Object.create(BaseComponent.prototype);
CreatorComponent.prototype.constructor = CreatorComponent;
///

CreatorComponent.prototype.createBullet = function() {	
    console.log("CreatorComponent createBullet");
    var player = this.owner.components.get("player");
    var bullet = EntityFactory.createBullet(player);
    return bullet;
}

module.exports = CreatorComponent;
