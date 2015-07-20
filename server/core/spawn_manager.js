'use strict';

var spawn_settings = require('../../shared/settings/spawn_positions.json');
var GameEngine = require('../../shared/game_engine.js');
var _ = require('underscore');

//Static class
var SpawnManager = {
	getSpawnInfo : function(name) {
		//Just check teams specifieds in spawn_settings
		//Spawn based in names of current teams
		var team = null;
		if(name === 'red') team = 0;
		else if(name === 'blue') team = 1;
		if(!_.isNull(team)) {
			var valid = false;
			var position = {};
			var id = 0;

			//Check for all slots - 1
			//If still not valid, just put in the last one
			for(id = 0; id < 4 && valid === false;) {
				position = { x: spawn_settings.teams[team].positions[id].x, y: spawn_settings.teams[team].positions[id].y }; 

				var hitPoint = [];
				valid = true;
				for(var i = -1; i <= 1 && valid === true; i++) {
					for(var j = -1; j <= 1 && valid === true; j++) {
						hitPoint = [position.x + i*spawn_settings.hitPointInterval.x, 
							position.y + j*spawn_settings.hitPointInterval.y];
						if(GameEngine.getInstance().world.hitTest(hitPoint, GameEngine.getInstance().world.bodies).length !== 0) {
							valid = false;
						}
					}
				}
				if(valid === false) id++;
			}	 
			return { x: spawn_settings.teams[team].positions[id].x, 
				y: spawn_settings.teams[team].positions[id].y,
				angle: spawn_settings.teams[team].positions[id].angle }; 
		}
		else return {x: 100, y: 100, angle: 0};
   	},
};

module.exports = SpawnManager;