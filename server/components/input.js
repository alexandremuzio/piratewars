'use strict'

var InputComponent = require('../../shared/components/input.js');

function ServerInputComponent(snapshots) {
	// console.log("inside serverInputComponent constr");
	InputComponent.apply(this);
	this._snapshots = snapshots;
}

///
ServerInputComponent.prototype = Object.create(InputComponent.prototype);
ServerInputComponent.prototype.constructor = ServerInputComponent;
///

ServerInputComponent.prototype.update = function() {
	// console.log("input update!!!!");
	var message = this._snapshots.getLast();
	// console.log(message);
	if (message) {
		this._snapshots.clear();
		// console.log("Applying!");
		// console.log("tempEntities on input: ", message);
		if (message.tempEntities) {
			this.owner.subentityManager.get('cannons_manager').components.get('cannons_manager_controller').temporaryEntitiesIDs = message.tempEntities;
		}
		this.processCommand(message.commands);
	}
	else if (this.followingTrajectory) {
		this.processCommand({});
	}
}

module.exports = ServerInputComponent;