'use strict';

var prop = require('./next_position_indicator_properties.json');

// After create subentity concept delete this class and create it as an entity with 4 redArrow subentitys
function NextPositionIndicator( game, x, y ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.arrowSprites = [];

    for( var i = 0; i < 4; i++ ){
        var arrowSprite = game.add.sprite(x, y, 'red_arrow');
        arrowSprite.anchor.setTo(0, 0.5);
        arrowSprite.scale.setTo(prop.scale, prop.scale);
        arrowSprite.angle = 90*i+prop.angle;
        this.arrowSprites[i] = arrowSprite;
    }
}

NextPositionIndicator.prototype.update = function() {
	for( var i = 0; i < 4; i++ ){
        this.arrowSprites[i].angle -= prop.rotation_velocity*this.game.time.elapsed/1000;
    }
}

NextPositionIndicator.prototype.autoDestroy = function() {
    for( var i = 0; i < 4; i++ ){
        this.arrowSprites[i].kill();

        if (this.arrowSprites[i].group){
           this.arrowSprites[i].group.remove(this.arrowSprites[i]);
        }
        else if (this.arrowSprites[i].parent){
           this.arrowSprites[i].parent.removeChild(this.arrowSprites[i]);
        }
    }
    delete this;
}

module.exports = NextPositionIndicator;