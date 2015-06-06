'use strict'

function GameComponent() {
	console.log("inside gameComponent constr");
};

GameComponent.prototype.init = function() {
	console.log("inside init");
};

GameComponent.prototype.update = function() {
	console.log("inside update");
};

GameComponent.prototype.key = 'component';
GameComponent.prototype.owner = null;

module.exports = GameComponent;