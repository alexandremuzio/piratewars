'use strict'

var InputComponent = require('../../shared/components/input.js');

function PhaserInputComponent(input, snapshots) {
	console.log("inside PhaserInputComp constr");
	this.key = "input";
	this._input = input;
    this._snapshots = snapshots;

    // this._cursorKeys = this._input.keyboard.createCursorKeys();
    // this._attackKey = this._input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

///
PhaserInputComponent.prototype = Object.create(InputComponent.prototype);
PhaserInputComponent.prototype.constructor = PhaserInputComponent;
///

PhaserInputComponent.prototype.init = function() {
	this._cursorKeys = this._input.keyboard.createCursorKeys();
    this._attackKey = this._input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

/**
 * @override
 */
PhaserInputComponent.prototype.update = function() {
	//console.log("input");
	this.captureInput();
}

PhaserInputComponent.prototype.captureInput = function() {
	var command = [];

	// check if arrow keys are pressed
    if (this._cursorKeys.up.isDown) {
        command.push('arrowUp');
    } else if (this._cursorKeys.down.isDown) {
        command.push('arrowDown');
    }
    if (this._cursorKeys.left.isDown) {
        command.push('arrowLeft');
    } else if (this._cursorKeys.right.isDown) {
        command.push('arrowRight');
    }

    // check if the attack key is pressed
    if (this._attackKey.isDown) {
        command.push('space');
    }

    if (command.length > 0) {
        this.processCommand(command);
        this._snapshots.add(command);
    }
}

module.exports = PhaserInputComponent;