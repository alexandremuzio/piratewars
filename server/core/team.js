'use strict'

function Team(room) {
	console.log("inside team constr");
	this.players = [];
	this.points = 0;
	this.room = room;
}

Team.prototype.addPlayer = function(player) {
	this.players.push(player);
}

module.exports = Team;