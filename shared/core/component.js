'use strict'

function GameComponent() {
	console.log("inside gameComponent constr");
};

GameComponent.prototype.init = function() {};

GameComponent.prototype.update = function() {};

GameComponent.prototype.key = 'component';

GameComponent.prototype.owner = null;

module.exports = GameComponent;