'use strict'

function ComponentManager(owner) {
	this._components = {};
	this._owner = owner;
};

ComponentManager.prototype.update = function() {
	for (var i in this._components) {
		this._components[i].update();
	}
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