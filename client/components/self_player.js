'use strict'

var Entity = require('../../shared/core/entity.js');
var Player = require('../../shared/components/player.js');
var PlayerPhysicsComponent = require('../../shared/components/player_physics.js');
var PlayerSpriteComponent = require('./player_sprite.js');
var PhaserInputComponent = require('./input.js');

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