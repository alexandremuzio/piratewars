'use strict'

var _ = require('underscore');

function ChildrenManager(owner) {
	this._children = {};
	this._owner = owner;
	this._nChildren = 0;
};

// child must be an reference to an entity
ChildrenManager.prototype.add = function(child) {
	console.log('call ChildrenManager.add');
	console.log('child.key: ' + child.key);
	if( child ){
		if( this._children[child.key]  ){
			console.error("Trying add subentities with the same key");
		}
		this._children[child.key] = child;
		this._nChildren++;
	}
	else
		console.error('Add invalid child');
};

// child must be an reference to an entity
ChildrenManager.prototype.remove = function(childOrKey) {
	console.log('remove called -------------------------' + childOrKey);

	if( typeof childOrKey == 'string' ){
		if( this._children[childOrKey] ){
			this._nChildren--;
			delete this._children[childOrKey];
		}
	}
	else if( typeof childOrKey == 'object' ){
		if( this._children[childOrKey.key] ){
			this._nChildren--;
			delete this._children[childOrKey.key];
		}
	}
};

ChildrenManager.prototype.hasChildren = function() {
	return this._nChildren > 0;
};

ChildrenManager.prototype.getChildrenArray = function() {
	return this._children;
};

ChildrenManager.prototype.getChild = function(key) {
	return this._children[key];
};

ChildrenManager.prototype.nChildren = function() {
	return this._nChildren; 
};

module.exports = ChildrenManager;