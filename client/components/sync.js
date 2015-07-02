'use strict'

var GameComponent = require('../../shared/core/component.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');
var _ = require('underscore');
function SyncComponent() {
	// console.log("inside SyncComponent constr");
	this.key = "outSync";
	this.snapshots = new SnapshotManager();
	this._stepCounter = 0;
};

///
SyncComponent.prototype = Object.create(GameComponent.prototype);
SyncComponent.prototype.constructor = SyncComponent;
///

SyncComponent.prototype.init = function() {
	this.owner.on('entity.sync', this.onSyncronization.bind(this));
	this.owner.on('entity.syncAfter', this.onSyncronizationAfter.bind(this));
    this._socket = this.owner.components.get('network').socket;
    setInterval(this.sendSyncToServer.bind(this), 1000/30);
}

SyncComponent.prototype.sendSyncToServer = function() {//update = function() {
	// This should be out of here if we don't want to send a sync every step
	// Change getLast to send a pack of inputs if this happens
	var lastSnapshot = this.snapshots.getLast();
	if (lastSnapshot) {
		this.snapshots.clear();
		// console.log(lastSnapshot);
		var message = {commands: lastSnapshot};
		
		// Bullet ID's
		// console.log(this.owner.subentityManager.get('cannons_manager').components.get('cannons_manager_controller'));
		var tempEntities = this.owner.subentityManager.get('cannons_manager').components.get('cannons_manager_controller').getTempEntities();
		// console.log("tempEntities inside sync", tempEntities);
		if (tempEntities.length > 0) {
			message.tempEntities = tempEntities;
			// console.log("Sending bullets, message= ", message);
		}

		// Mine ID's
		var mineTempEntities = this.owner.components.get('mine_generator').getTempEntities();
		// console.log("mineTempEntities inside sync", mineTempEntities);
		if (mineTempEntities.length > 0) {
			message.mineTempEntities = mineTempEntities;
			// console.log("Sending mines, message= ", message);
		}

		message.step = this._stepCounter++;
		this._socket.emit('client.sync', message);
	}
}

SyncComponent.prototype.onSyncronization = function(message) {
	// MPTest
	// console.log('--- onSyncronization called --- #############################');
	if (!_.isUndefined(message.transform) && !_.isNull(message.transform)) {
		this.owner.transform.setTransform(message.transform);
	}
}

SyncComponent.prototype.onSyncronizationAfter = function(message) {
	if (!_.isUndefined(message.health) && !_.isNull(message.health)) {
		this.owner.components.get("health").setHealth(message.health); //TO DO
	}
}

module.exports = SyncComponent;