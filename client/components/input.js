'use strict'

var _ = require('underscore');
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
    this._nextPositionIndicator;
    this._lastFollowingTrajectory = false;
    this._lastRotating = false;
    // MPTemp
    this._commandId = 0;

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

    /* This is in Input Shared */
    this.owner.on('entity.revive', this.onEntityRevive.bind(this));
    this.owner.on('entity.die', this.onEntityDie.bind(this));
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
    this.updateNextPositionIndicator();
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

    // check if the attack keys are pressed
    if (this._leftAttackKey.isDown) {
        command.qKey = true;
    }
    if (this._rightAttackKey.isDown) {
        command.eKey = true;
    }

    // MPTemp
    command.id = this._commandId++;

    this.processCommand(command);
    
    if (!_.isEmpty(command)) {
        this._snapshots.add(command);
    }
}

PhaserInputComponent.prototype.updateNextPositionIndicator = function() {
    if( !this._followingTrajectory && this._lastFollowingTrajectory && this._nextPositionIndicator ){
        this._nextPositionIndicator.autoDestroy();
        this._nextPositionIndicator = null;
    }
    this._lastFollowingTrajectory = this._followingTrajectory;

    if( !this._rotating && this._lastRotating && this._nextPositionIndicator ){
        this._nextPositionIndicator.autoDestroy();
        this._nextPositionIndicator = null;
    }
    this._lastRotating = this._rotating;

    if( this.initNewTrajectoryCalled ){
        if( this._nextPositionIndicator )
            this._nextPositionIndicator.autoDestroy();
        this._nextPositionIndicator = new NextPositionIndicatorConstructor(this._input.game, this._clickedPoint.x, this._clickedPoint.y);
        this.initNewTrajectoryCalled = false;
    }

    if( this._nextPositionIndicator )
        this._nextPositionIndicator.update();
}

module.exports = PhaserInputComponent;