'use strict'

function SnapshotManager() {
	this._snapshots = [];
};

SnapshotManager.prototype.add = function(snapshot) {
	this._snapshots.push(snapshot);
};

SnapshotManager.prototype.getLast = function(key) {
	var lastSnapshot = this._snapshots.pop();
	this._snapshots = [];
	return lastSnapshot;
};

module.exports = SnapshotManager;