'use strict'

var GameComponent = require('../core/component.js');

function Player() {
	this.key = "player";

	this.playerHeath = 100;
};

///
Player.prototype = Object.create(GameComponent.prototype);
Player.prototype.constructor = Player;
///

/**
 * @override
 */
Player.prototype.update = function() {}


module.exports = Player;