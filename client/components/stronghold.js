'use strict'

var BaseComponent = require('../../shared/components/stronghold');
var GameEngine = require('../../shared/game_engine');

function StrongholdComponent() {
	BaseComponent.apply(this);
}

///
StrongholdComponent.prototype = Object.create(BaseComponent.prototype);
StrongholdComponent.prototype.constructor = StrongholdComponent;
///

// BulletComponent.prototype.onCollision = function(collider) {
// 	// this.owner.destroy();
// };

module.exports = StrongholdComponent;