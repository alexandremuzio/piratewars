'use strict'

function SnapshotManager() {
	this._snapshots = [];
};

SnapshotManager.prototype.add = function(snapshot) {
	this._snapshots.push(snapshot);
};

SnapshotManager.prototype.getLast = function(key) {
	return this._snapshots.shift();
};

module.exports = SnapshotManager;