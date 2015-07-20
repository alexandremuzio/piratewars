'use strict';

var _ = require('underscore');

function SubentityManager(owner) {
	this._subentitys = {};
	this._owner = owner;
	this._nSubentitys = 0;
}

// subentity must be an reference to an entity
SubentityManager.prototype.add = function(subentity) {
	if( subentity ){
		if( this._subentitys[subentity.key]  ){
			console.error("Trying add subentities with the same key");
		}
		this._subentitys[subentity.key] = subentity;
		this._nSubentitys++;
	}
	else
		console.error('Add invalid subentity');
};

// subentity must be an reference to an entity
SubentityManager.prototype.remove = function(subentityOrKey) {
	if( typeof subentityOrKey == 'string' ){
		if( this._subentitys[subentityOrKey] ){
			this._nSubentitys--;
			delete this._subentitys[subentityOrKey];
		}
	}
	else if( typeof subentityOrKey == 'object' ){
		if( this._subentitys[subentityOrKey.key] ){
			this._nSubentitys--;
			delete this._subentitys[subentityOrKey.key];
		}
	}
};

SubentityManager.prototype.hasSubentity = function() {
	return this._nSubentitys > 0;
};

SubentityManager.prototype.getAll = function() {
	return this._subentitys;
};

SubentityManager.prototype.get = function(key) {
	return this._subentitys[key];
};

SubentityManager.prototype.nSubentitys = function() {
	return this._nSubentitys; 
};

module.exports = SubentityManager;