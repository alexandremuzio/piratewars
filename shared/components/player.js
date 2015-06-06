'use strict'

var Entity = require('../core/entity.js');
var PlayerPhysicsComponent = require('./player_physics.js');

function Player() {
	Entity.call(this);
	this.components.add(new PlayerPhysicsComponent());
	this.components.get("physics").body.velocity[0] = 500;
	// this.update = function() {
	// 	console.log("inside player update");
	// };
};

///
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
///

/**
 * @override
 */
// Player.prototype.update = function() {
// }

module.exports = Player;