'use strict'

var BaseComponent = require('../../shared/core/component.js');
var EntityFactory = require('../core/entity_factory.js');

function CreatorComponent() {
	this.key = "creator";
	console.log(EntityFactory);
	console.log("Dentro do creator")
}

///
CreatorComponent.prototype = Object.create(BaseComponent.prototype);
CreatorComponent.prototype.constructor = CreatorComponent;
///

CreatorComponent.prototype.createBullet = function() {
    var player = this.owner.components.get("player");
    console.log(EntityFactory);
    var bullet = EntityFactory.createBullet(player);
    return bullet;
}

module.exports = CreatorComponent;
