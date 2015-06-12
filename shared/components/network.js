'use strict'

var ComponentBase = require('../core/component');

function NetworkComponent(socket) {
	this.key = 'network';
	this.socket = socket;
};

///
NetworkComponent.prototype = Object.create(ComponentBase.prototype);
NetworkComponent.prototype.constructor = NetworkComponent;
///

module.exports = NetworkComponent;