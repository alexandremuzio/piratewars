'use strict'

var GameEngine = require('../../shared/game_engine.js');
var GameComponent = require('../../shared/core/component.js');

function NetworkComponent(socket) {
	console.log("inside NetworkComponent constr");
	this.key = "network";
	this._socket = socket;
};

///
NetworkComponent.prototype = Object.create(GameComponent.prototype);
NetworkComponent.prototype.constructor = NetworkComponent;
///

NetworkComponent.prototype.init = function() {
	this.owner.on('sync', this.onSyncronization.bind(this));
}

NetworkComponent.prototype.onSyncronization = function(transform) {
	this.owner.transform.position = transform.position;
	this.owner.transform.angle = transform.angle;
}

module.exports = NetworkComponent;