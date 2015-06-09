'use strict'

var ComponentBase = require('../core/component');

function NetworkComponent(socket) {
	this.key = 'network';
	this._socket = socket;
};


///
NetworkComponent.prototype = Object.create(BaseComponent.prototype);
NetworkComponent.prototype.constructor = NetworkComponent;
///