'use strict'

var BaseComponent = require('../../shared/components/player_controller');

function Player() {
	this.key = "player";
};

///
Player.prototype = Object.create(BaseComponent.prototype);
Player.prototype.constructor = Player;
///

// Player.prototype.update = function(){ 
// 	console.log(this.owner.components.get("physics").body.position);
// }

module.exports = Player;