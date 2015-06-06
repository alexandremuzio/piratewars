'use strict'

var GameComponent = require('./core/component.js');
var p2 = require('p2');

// Singleton class
var GameEngine = (function () {
	var instance;
	function init() {
		// Private properties and functions
		// function privateMethod() {
		// 	console.log("I'm private");
		// };
		// var privateVariable = "I'm private";
		var _world = new p2.World({gravity:[0,0]});
		var _entities = [];
		var _stepLength = 1/60; //in seconds

		return {
			// Public properties and functions
			world: _world,
			gameStep: function() {
				for (var i in _entities) {
					_entities[i].update();
					// console.log("i = " + i);
					// console.log(_entities[i].components.get("physics").body.position[0]);
				}
				_world.step(_stepLength);
			},
			addEntity: function(entity) {
				_entities.push(entity);
			},
			deleteEntity: function(entity) {
				
			}
		};
	};
	return {
		getInstance: function () {
			if (!instance) {
				instance = init();
			}
			return instance;
		}
	};
})();

module.exports = GameEngine;