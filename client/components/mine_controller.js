'use strict'

var BaseComponent = require('../../shared/core/component.js');

var mine_settings = require('../../shared/settings/mine.json');

function MineController() {
	this.key = "mine_controller";
	this._createdTime = new Date();
	
};

///
MineController.prototype = Object.create(BaseComponent.prototype);
MineController.prototype.constructor = MineController;
///

MineController.prototype.update = function(){ 
	var currentTime = new Date();
	if( currentTime - this._createdTime > mine_settings.time_to_sink ){
		this.owner.destroy();
	}
}

module.exports = MineController;