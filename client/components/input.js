'use strict'

var InputComponent = require('../../shared/components/input.js');
var NextPositionIndicatorConstructor = require('../next_position_indicator/next_position_indicator.js');

function PhaserInputComponent(input) {
	// console.log("inside PhaserInputComp constr");
	this._input = input;
	this._sequence = 0;
    this._cursorKeys;
    this._attackKey;
    this._socket;
    this._mouseLeftButtonDown = false;
    this._mouseWorldX;
    this._mouseWorldY;
    this._nextPointIndicator;
    this.client = true;

    // Call base constructor  
    InputComponent.call(this, input.game);

    // this._cursorKeys = this._input.keyboard.createCursorKeys();
    // this._attackKey = this._input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

///
PhaserInputComponent.prototype = Object.create(InputComponent.prototype);
PhaserInputComponent.prototype.constructor = PhaserInputComponent;
///

PhaserInputComponent.prototype.init = function() {
	this._cursorKeys = this._input.keyboard.createCursorKeys();
    this._leftAttackKey = this._input.keyboard.addKey(Phaser.Keyboard.Q);
    this._rightAttackKey = this._input.keyboard.addKey(Phaser.Keyboard.E); 
    this._input.mouse.onMouseDown = this.onMouseDown.bind(this);
    
    this._snapshots = this.owner.components.get('outSync').snapshots;
    this._socket = this.owner.components.get('network').socket;
}

PhaserInputComponent.prototype.onMouseDown = function() {
    if( event.button === 0 ){
        this._mouseLeftButtonDown = true;
        this._mouseWorldX = this._input.mousePointer.worldX;
        this._mouseWorldY = this._input.mousePointer.worldY;
    }
}

/**
 * @override
 */
PhaserInputComponent.prototype.update = function() {
	//console.log("input");
	this.captureInput();
    if( this._nextPointIndicator )
        this._nextPointIndicator.update();
}

PhaserInputComponent.prototype.captureInput = function() {
	var command = {};

	// check if arrow keys are pressed
    if (this._cursorKeys.up.isDown && !this._cursorKeys.down.isDown) {
        command.arrowUp = true;
    } else if (this._cursorKeys.down.isDown) {
        command.arrowDown = true;
    }
    if (this._cursorKeys.left.isDown && !this._cursorKeys.right.isDown) {
        command.arrowLeft = true;
    } else if (this._cursorKeys.right.isDown) {
        command.arrowRight = true;
    }

    // check if the mouse was clicked
    if( this._mouseLeftButtonDown ){
        command.mouseLeftButtonDown = true;
        command.mouseWorldX = this._mouseWorldX;
        command.mouseWorldY = this._mouseWorldY;
        this._mouseLeftButtonDown = false;
    }

// <<<<<<< HEAD
//     // check if the attack keys are pressed
//     if (this._leftAttackKey.isDown) {
//         command.push('q');
//     }
//     if (this._rightAttackKey.isDown) {
//         command.push('e');
// =======
//     // check if the attack key is pressed
//     if (this._attackKey.isDown) {
//         command.space = true;
// >>>>>>> Adding move by click and updating moving by arrows
//     }

    if (command.length > 0) {
        this.processCommand(command);
        this._snapshots.add(command);
    }
}

PhaserInputComponent.prototype.createNextPointIndicator = function(x, y) {
    this._nextPointIndicator = new NextPositionIndicatorConstructor(this._input.game, x, y );
}

module.exports = PhaserInputComponent;