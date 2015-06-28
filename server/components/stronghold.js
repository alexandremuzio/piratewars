'use strict'

var BaseComponent = require('../../shared/components/stronghold');
var GameEngine = require('../../shared/game_engine');

///////////////////// Send these to a data file /////////////////////////////
var strongholdHealth = 3000;

function StrongholdComponent() {
	BaseComponent.apply(this);
}

///
StrongholdComponent.prototype = Object.create(BaseComponent.prototype);
StrongholdComponent.prototype.constructor = StrongholdComponent;
///

StrongholdComponent.prototype.init = function() {
	this.currentTime = new Date();
}

module.exports = StrongholdComponent;