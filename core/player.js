'use strict'

var Entity = require('./entity.js');
var PlayerPhysicsComponent = require('./player_physics_component.js');

function Player() {
	Entity.call(this);
	this.update = function() {
		console.log("inside player update");
		this.components.get("physics").body.velocity[0] = 1;
	}
	this.components.add(new PlayerPhysicsComponent(), "physics");
};

///
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
///

module.exports = Player;