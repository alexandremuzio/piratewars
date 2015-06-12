'use strict'

var BaseComponent = require('../../shared/components/input');

function InputComponent(snapshots) {
	console.log("inside serverInputComponent constr");
	this._snapshots = snapshots;
	console.log(snapshots);
};

///
InputComponent.prototype = Object.create(BaseComponent.prototype);
InputComponent.prototype.constructor = InputComponent;
///

InputComponent.prototype.init = function() {
	var socket = this.owner.components.get('network').socket;
    socket.on('client.sync', this.onInput.bind(this));
};

InputComponent.prototype.onInput = function(transform) {
	/////////change transform to list of inputs
	this._snapshots.add(transform);
}

module.exports = InputComponent;