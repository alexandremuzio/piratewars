'use strict'

var _ = require('underscore');

function ComponentManager(owner) {
	this._components = {};
	this._owner = owner;
};

ComponentManager.prototype.updateBeforeWorldStep = function() {
	_.each(this._components, function(component){
		if( component.key != 'sprite' )
			component.update();
	});
};

ComponentManager.prototype.updateAfterWorldStep = function() {
	this._owner.transform.update();
	var spriteComponent = this.get('sprite');
	if( spriteComponent )
		spriteComponent.update();
};

ComponentManager.prototype.add = function(component) {
	component.owner = this._owner;
	component.init();
	this._components[component.key] = component;
};

ComponentManager.prototype.get = function(key) {
	return this._components[key];
};

module.exports = ComponentManager;