'use strict'

var BaseComponent = require('../../shared/components/input');

function InputComponent() {
	
};

InputComponent.prototype.init = function() {
	var socket = this.owner.components.get('network');
    socket.on('sync.input', this.onInput.bind(this));
};


InputComponent.prototype.onInput = function(transform) {
	/////////change transform to list of inputs
	this.owner.transform = transform;
}

///
InputComponent.prototype = Object.create(BaseComponent.prototype);
InputComponent.prototype.constructor = InputComponent;
///