'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');

function SyncComponent(socket) {
	console.log("inside SyncComponent constr");
	this.key = "network";
	this._socket = socket;
};

///
SyncComponent.prototype = Object.create(GameComponent.prototype);
SyncComponent.prototype.constructor = SyncComponent;
///

SyncComponent.prototype.init = function() {
	this.owner.on('sync', this.onSyncronization.bind(this));
}

SyncComponent.prototype.onSyncronization = function(transform) {
	this.owner.transform = transform;
}

module.exports = SyncComponent;