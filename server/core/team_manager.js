var _ = require('underscore');

function TeamManager () {
	this._teams= {};
}

TeamManager.prototype.add = function(key, value) {
	this._teams[key] = value;
}

TeamManager.prototype.get = function(key) {
	return this._teams[key];
}

TeamManager.prototype.getWeakest = function() {
	var minKey = "";
	var minNumberOfMembers = 999999;

	_.each(this._teams, function(team, teamKey) {
		if (team.size() < minNumberOfMembers) {
			minNumberOfMembers = team.size();
			minKey = teamKey;
		}
	});

	return  this._teams[minKey];
}


module.exports = TeamManager