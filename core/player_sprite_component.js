'use strict'

var SpriteComponent = require('./sprite_component.js');

function PlayerSpriteComponent(game) {
	console.log("inside PlayerSpriteComp constr");
    SpriteComponent.call(this, game, "boat_0");    
};

///
PlayerSpriteComponent.prototype = Object.create(SpriteComponent.prototype);
PlayerSpriteComponent.prototype.constructor = PlayerSpriteComponent;
///

module.exports = PlayerSpriteComponent;