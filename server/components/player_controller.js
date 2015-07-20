'use strict';

var BaseComponent = require('../../shared/components/player_controller');

function Player(team) {
	BaseComponent.apply(this);

	this._team = team;
}

///
Player.prototype = Object.create(BaseComponent.prototype);
Player.prototype.constructor = BaseComponent;
///

Player.prototype.init = function() {
	this._team.addPlayer(this.owner);

	this.owner.initialAttrs.set({
        team: this._team.name,
        teamColor: this._team.color
	});

	// this.owner.on("entity.damage", this.onDamage.bind(this));
	// this.owner.on("entity.collision", this.onCollision.bind(this));
};

Player.prototype.update = function() {};

// Player.prototype.onDamage = function(amount, attacker) {
// 	this.playerHeath -= amount;
// 	//check if player died;
// 	console.log("Player lost life!");
// }

// Player.prototype.onCollision = function(collider) {
// 	console.log("Player collided!");

// 	// if (collider.key == "bullet") {
// 	// 	console.log(collider);
// 	// 	var damage = collider.components.get("bullet").damage;
// 	// 	this.owner.damage(damage, collider);
// 	// }
// };

module.exports = Player;