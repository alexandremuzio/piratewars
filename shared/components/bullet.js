'use strict'


function Bullet() {
	

}

///
Bullet.prototype = Object.create(GameComponent.prototype);
Bullet.prototype.constructor = Bullet;
///