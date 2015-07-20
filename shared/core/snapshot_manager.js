'use strict';

function SnapshotManager() {
	this._snapshots = [];
}

SnapshotManager.prototype.add = function(snapshot) {
	this._snapshots.push(snapshot);
};

SnapshotManager.prototype.clear = function() {
	this._snapshots = [];
};

SnapshotManager.prototype.getLast = function(key) {
	return this._snapshots.pop();
};

SnapshotManager.prototype.length = function(key) {
	return this._snapshots.length;
};

module.exports = SnapshotManager;