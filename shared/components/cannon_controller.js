'use strict';

var ComponentBase = require('../core/component');

function CannonController() {
	this.key = 'cannon_controller';
}

///
CannonController.prototype = Object.create(ComponentBase.prototype);
CannonController.prototype.constructor = CannonController;
///

CannonController.prototype.update = function () {
};

module.exports = CannonController;