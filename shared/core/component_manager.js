'use strict'

function ComponentManager(owner) {
	this._components = {};
	this._owner = owner;
	console.log("ComponentManager \\/")
	// console.log(owner);
};

ComponentManager.prototype.update = function() {
	for (var i in this._components) {
		this._components[i].update();
	}
};

ComponentManager.prototype.add = function(component) {
	console.log(this._owner);
	component.owner = this._owner;
	component.init();
	this._components[component.key] = component;

	console.log("inside compManagerAdd \\/");
	console.log(this._components[component.key].owner);	
};

ComponentManager.prototype.get = function(key) {
	return this._components[key];
};

module.exports = ComponentManager;