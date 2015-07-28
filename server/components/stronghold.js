'use strict';

var BaseComponent = require('../../shared/components/stronghold');

function StrongholdComponent() {
	BaseComponent.apply(this);
}

///
StrongholdComponent.prototype = Object.create(BaseComponent.prototype);
StrongholdComponent.prototype.constructor = StrongholdComponent;
///

StrongholdComponent.prototype.init = function () {
	this.currentTime = new Date();
};

module.exports = StrongholdComponent;