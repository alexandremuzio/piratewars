'use strict'

var GameComponent = require('../core/component');
var GameEngine = require('../game_engine');

///////////////////// Send these to a data file /////////////////////////////
var strongholdHealth = 3000;

function StrongholdComponent() {
	this.key = "stronghold";
	this.health = strongholdHealth;
}

///
StrongholdComponent.prototype = Object.create(GameComponent.prototype);
StrongholdComponent.prototype.constructor = StrongholdComponent;
///

StrongholdComponent.prototype.init = function() {
	this.currentTime = new Date();
}

module.exports = StrongholdComponent;