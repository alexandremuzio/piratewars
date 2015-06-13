'use strict'

var InputComponent = require('../../shared/components/input.js');

function ServerInputComponent(snapshots) {
	console.log("inside serverInputComponent constr");
	this.key = "input";
	this._snapshots = snapshots;
}

///
ServerInputComponent.prototype = Object.create(InputComponent.prototype);
ServerInputComponent.prototype.constructor = ServerInputComponent;
///

ServerInputComponent.prototype.update = function() {
	// console.log("input update!!!!");
	var lastSnapshot = this._snapshots.getLast();
	// console.log(lastSnapshot);
	if (lastSnapshot) {
		this._snapshots.clear();
		// console.log("Applying!");
		this.processCommand(lastSnapshot);
	}
}

module.exports = ServerInputComponent;