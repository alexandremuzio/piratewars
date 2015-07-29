'use strict';

var _ = require('underscore');
var GameComponent = require('../../shared/core/component.js');

function SoundComponent(sounds) {
	console.log('inside SoundComponent constr');
	this.key = 'sound';
	
	this._sounds =  sounds;
}

SoundComponent.prototype = Object.create(GameComponent.prototype);
SoundComponent.prototype.constructor = SoundComponent;

SoundComponent.prototype.init = function () {
	this.owner.on('entity.remove', this.onEntityRemove.bind(this));
 };
 
SoundComponent.prototype.play = function(key, volume, loop) {
	this._sounds[key].play('', 0, volume, loop);
};

SoundComponent.prototype.onEntityRemove = function (key, volume, loop) {
	_.each(this._sounds,  function(sound) {
		sound.destroy();
	});
};

module.exports = SoundComponent;