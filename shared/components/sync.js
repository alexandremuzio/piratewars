'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');

function SyncComponent(snapshots) {
	console.log("inside SyncComponent constr");
	this.key = "sync";
	this._snapshots = snapshots;
};

///
SyncComponent.prototype = Object.create(GameComponent.prototype);
SyncComponent.prototype.constructor = SyncComponent;
///

SyncComponent.prototype.init = function() {
    this._socket = this.owner.components.get('network').socket;
	this.owner.on('entity.sync', this.onSyncronization.bind(this));
}

SyncComponent.prototype.update = function() {
	// This should be out of here if we don't want to send a sync every step
	// Change getLast to send a pack of inputs if this happens
	var lastSnapshot = this._snapshots.getLast();
	if (lastSnapshot) {
		this._snapshots.clear();
		// console.log(lastSnapshot);
		this._socket.emit('client.sync', lastSnapshot);
	}
}

SyncComponent.prototype.onSyncronization = function(transform) {
	// console.log("syncronizing self player with position: ", transform.position);
	this.owner.components.get('physics').setTransform(transform);
}

module.exports = SyncComponent;