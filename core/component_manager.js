'use strict'

function ComponentManager() {
	this._components = {};
};

ComponentManager.prototype.update = function() {
	for (var i in _components) {
		_components[i].update();
	}
};

ComponentManager.prototype.add = function(component, key) {
	this._components[key] = component;
};

ComponentManager.prototype.get = function(key) {
	return this._components[key];
};

module.exports = ComponentManager;