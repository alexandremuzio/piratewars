'use strict';

var GameComponent = require('../core/component');

function StrongholdComponent() {
	this.key = 'stronghold';
}

///
StrongholdComponent.prototype = Object.create(GameComponent.prototype);
StrongholdComponent.prototype.constructor = StrongholdComponent;
///

StrongholdComponent.prototype.init = function() {
	this.currentTime = new Date();
};

module.exports = StrongholdComponent;