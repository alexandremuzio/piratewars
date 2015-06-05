'use strict'

function GameComponent() {
	console.log("inside gameComponent constr");
};

GameComponent.prototype.update = function() {
	console.log("inside update");
};

GameComponent.prototype.key = 42;

module.exports = GameComponent;