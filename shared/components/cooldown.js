'use strict'

var BaseComponent = require('../../shared/core/component.js');

//cooldown used for bullet
function CooldownComponent() {
	this.key = "cooldown";
	this.chargeTime = 1000;
	this.lastUsedTime = new Date();
}

///
CooldownComponent.prototype = Object.create(BaseComponent.prototype);
CooldownComponent.prototype.constructor = CooldownComponent;
///

CooldownComponent.prototype.activate = function() {
	var currentTime = new Date();
	if (currentTime - this.lastUsedTime < this.chargeTime) {
		// console.log("cooldown false");
		return false;
	}

	this.lastUsedTime = currentTime;
	// console.log("cooldown true");
	return true;
}

module.exports = CooldownComponent;
