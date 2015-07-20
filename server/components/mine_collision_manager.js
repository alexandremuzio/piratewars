'use strict';

var BaseComponent = require('../../shared/core/component.js');

function MineCollisionManager() {
	// BaseComponent.call(this);
	this.key = 'mine_collision_manager';
	this._collisions = [];
}

///
MineCollisionManager.prototype = Object.create(BaseComponent.prototype);
MineCollisionManager.prototype.constructor = MineCollisionManager;
///

MineCollisionManager.prototype.update = function(){ 
};

MineCollisionManager.prototype.newCollision = function(mineId, playerId){ 
	this._collisions.push({'mineId': mineId, 'playerId': playerId});
};

MineCollisionManager.prototype.getCollisions = function(){ 
	return this._collisions;
};

MineCollisionManager.prototype.clearCollisions = function(){ 
	this._collisions = [];
};

MineCollisionManager.prototype.hasCollision = function(){ 
	return this._collisions.length > 0;
};

module.exports = MineCollisionManager;