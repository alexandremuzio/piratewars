'use strict'

var _ = require('underscore');

function ChildrenManager(owner) {
	this._children = [];
	this._owner = owner;
};

// child must be an reference to an entity
ChildrenManager.prototype.add = function(child) {
	this._children.push(child);
};

ChildrenManager.prototype.hasChildren = function() {
	return this._children.length > 0;
};

ChildrenManager.prototype.getChildrenArray = function() {
	return this._children;
};

module.exports = ChildrenManager;