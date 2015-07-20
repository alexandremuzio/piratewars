'use strict';

var BaseComponent = require('../core/component.js');
var mine_settings = require('../settings/mine.json');

//cooldown used for bullet
function CooldownComponent() {
	this.key = 'cooldown';
	this.chargeTime = 1000;
	this.mineChargeTime = mine_settings.charge_time;
	this.lastUsedTime = new Date();
	this.mineLastUsedTime = new Date();
}

///
CooldownComponent.prototype = Object.create(BaseComponent.prototype);
CooldownComponent.prototype.constructor = CooldownComponent;
///

CooldownComponent.prototype.activate = function() {
	var currentTime = new Date();
	if (currentTime - this.lastUsedTime < this.chargeTime) {
		// console.log('cooldown false');
		return false;
	}

	this.lastUsedTime = currentTime;
	// console.log('cooldown true');
	return true;
};

CooldownComponent.prototype.mineActivate = function() {
	var currentTime = new Date();
	if (currentTime - this.mineLastUsedTime < this.mineChargeTime) {
		// console.log('cooldown false');
		return false;
	}

	this.mineLastUsedTime = currentTime;
	// console.log('cooldown true');
	return true;
};

module.exports = CooldownComponent;
