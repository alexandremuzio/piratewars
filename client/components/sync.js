'use strict'

var GameComponent = require('../../shared/core/component.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');

function SyncComponent() {
	// console.log("inside SyncComponent constr");
	this.key = "outSync";
	this.snapshots = new SnapshotManager();
};

///
SyncComponent.prototype = Object.create(GameComponent.prototype);
SyncComponent.prototype.constructor = SyncComponent;
///

SyncComponent.prototype.init = function() {
	this.owner.on('entity.sync', this.onSyncronization.bind(this));
    this._socket = this.owner.components.get('network').socket;
}

SyncComponent.prototype.update = function() {
	// This should be out of here if we don't want to send a sync every step
	// Change getLast to send a pack of inputs if this happens
	var lastSnapshot = this.snapshots.getLast();
	if (lastSnapshot) {
		this.snapshots.clear();
		// console.log(lastSnapshot);
		this._socket.emit('client.sync', lastSnapshot);
	}
}

SyncComponent.prototype.onSyncronization = function(transform) {
	this.owner.components.get('physics').setTransform(transform);
}

module.exports = SyncComponent;