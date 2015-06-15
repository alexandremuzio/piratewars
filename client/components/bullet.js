'use strict'

var BaseComponent = require('../../shared/components/bullet');
var GameEngine = require('../../shared/game_engine');

function BulletComponent() {
	BaseComponent.apply(this);
}

///
BulletComponent.prototype = Object.create(BaseComponent.prototype);
BulletComponent.prototype.constructor = BulletComponent;
///

BulletComponent.prototype.init = function() {
	this.currentTime = new Date();
}

BulletComponent.prototype.update= function() {
}

module.exports = BulletComponent;