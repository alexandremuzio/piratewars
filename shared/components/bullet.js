'use strict'

var GameComponent = require('../core/component');
var GameEngine = require('../game_engine');

function BulletComponent() {
	this.key = "bullet";
}

///
BulletComponent.prototype = Object.create(GameComponent.prototype);
BulletComponent.prototype.constructor = BulletComponent;
///

module.exports = BulletComponent;