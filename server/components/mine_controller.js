'use strict'

var BaseComponent = require('../../shared/components/mine_controller.js');

var mine_settings = require('../../shared/settings/mine.json');

function MineController() {
	BaseComponent.call(this);
	this.sent = false;
};

///
MineController.prototype = Object.create(BaseComponent.prototype);
MineController.prototype.constructor = MineController;
///

MineController.prototype.update = function(){ 
	BaseComponent.prototype.update.call(this);
}

MineController.prototype.onCollisionOcured = function(collider){
	// console.log('call onCollisionOcured of server');
	this.owner.baseEntity.components.get('mine_collision_manager').newCollision(this.owner.id, collider.id);
}

module.exports = MineController;