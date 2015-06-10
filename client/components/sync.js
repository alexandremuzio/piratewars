'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');

function SyncComponent() {
	console.log("inside SyncComponent constr");
	this.key = "sync";
};

///
SyncComponent.prototype = Object.create(GameComponent.prototype);
SyncComponent.prototype.constructor = SyncComponent;
///

SyncComponent.prototype.update = function() {
}

SyncComponent.prototype.init = function() {
	this.owner.on('entity.sync', this.onSyncronization.bind(this));
}

SyncComponent.prototype.onSyncronization = function(transform) {
	 // console.log(transform.velocity);
	this.owner.components.get('physics').setTransform(transform);
}

module.exports = SyncComponent;