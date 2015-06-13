'use strict'

var GameComponent = require('../core/component.js');

function Bullet() {
	
}

///
Bullet.prototype = Object.create(GameComponent.prototype);
Bullet.prototype.constructor = Bullet;
///