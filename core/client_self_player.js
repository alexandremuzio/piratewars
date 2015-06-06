'use strict'

var Entity = require('./entity.js');
var Player = require('./player.js');
var PlayerPhysicsComponent = require('./player_physics_component.js');
var PlayerSpriteComponent = require('./player_sprite_component.js');
var PhaserInputComponent = require('../client/input_component.js');

function ClientSelfPlayer(game) {
	console.log("clientSelfPlayer constr");
	Player.call(this);
	this.components.add(new PlayerSpriteComponent(game));
	console.log("Going to start PHASER INPUT COMPONENT NOW!");
	this.components.add(new PhaserInputComponent(game.input));
	// this.update = function() {
	// 	// console.log("inside clientSelfPlayer update");
	// }.bind(this);
};

///
ClientSelfPlayer.prototype = Object.create(Player.prototype);
ClientSelfPlayer.prototype.constructor = ClientSelfPlayer;
///

module.exports = ClientSelfPlayer;