'use strict'

function Team(data, room) {
	// console.log("inside team constr");

	this.name = data.name;
	this.color = data.color;

	this._players = [];
	this._points = 0;
	this._room = room;
};

Team.prototype.addPlayer = function(player) {
	this._players.push(player);
};

Team.prototype.size = function() {
	return this._players.length;
};

module.exports = Team;