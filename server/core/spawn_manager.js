'use strict'

var spawn_settings = require('../../shared/settings/spawn_positions.json');
var GameEngine = require('../../shared/game_engine.js');
var _ = require('underscore');

//Static class
var SpawnManager = {
	getSpawnPosition : function(team) {
		//Just check teams specifieds in spawn_settings
		if(team == 0 || team == 1) {
			var valid = false;
			var position = {};
			var id = 0;

			//Check for all slots - 1
			//If still not valid, just put in the last one
			for(id = 0; id < 4 && valid === false; id++) {
				valid = true;
				position = { x: spawn_settings.teams[team].positions[id].x, y: spawn_settings.teams[team].positions[id].y }; 

				var hitPoint = {};
				valid = true;
				for(var i = -1; i <= 1 && valid === true; i++) {
					for(var j = -1; j <= 1 && valid === true; j++) {
						hitPoint = { x: position.x + i*spawn_settings.hitPointInterval.x, 
							y: position.y + j*spawn_settings.hitPointInterval.y};
						if(GameEngine.getInstance().world.hitTest(hitPoint, GameEngine.getInstance().world.bodies) != null) {
							valid = false;
						}
					}
				}
			}
			return position;
		}
		else return {x: 100, y: 100};
   	},
};

module.exports = SpawnManager;