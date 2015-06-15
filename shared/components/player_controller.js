'use strict'

var GameComponent = require('../core/component');

function Player() {
	this.key = "player";
};

///
Player.prototype = Object.create(GameComponent.prototype);
Player.prototype.constructor = Player;
///

module.exports = Player;