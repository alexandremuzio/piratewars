'use strict'

var GameComponent = require('../core/component.js');

function BulletComponent() {
	
}

///
BulletComponent.prototype = Object.create(GameComponent.prototype);
BulletComponent.prototype.constructor = BulletComponent;
///

module.exports = BulletComponent;