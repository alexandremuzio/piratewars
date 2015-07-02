'use strict'

var BaseComponent = require('../../shared/core/component.js');

function ScoreComponent() {
	// console.log("inside ScoreComponent constr");
	this.key = "score";
	// Reset this when game restart
	this._nDeath = 0;
	this._nKill = 0;
}

///
ScoreComponent.prototype = Object.create(BaseComponent.prototype);
ScoreComponent.prototype.constructor = ScoreComponent;
///

ScoreComponent.prototype.init = function() {
	// console.log('score init called -----------');
	this.owner.on("entity.damageDie", this.onDie.bind(this));
}

ScoreComponent.prototype.onDie = function(attacker) {
	// console.log('Player ' + this.owner.id + ' die =( ');
	this._nDeath++;
	attacker.components.get('score').incrementKill();
	// console.log('Attacker.id = ' + attacker.id);
}

ScoreComponent.prototype.incrementKill = function() {
	this._nKill++;
}

ScoreComponent.prototype.get = function() {
	return {
		"nDeath": this._nDeath,
		"nKill": this._nKill
	};
}

module.exports = ScoreComponent;
