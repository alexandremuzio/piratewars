'use strict'

var p2 = require('p2');
var _ = require('underscore');
var GameComponent = require('./core/component.js');

// Singleton class
var GameEngine = (function () {
	var instance;
	function init() {
		// Private properties and functions
		var _world = new p2.World({gravity:[0,0]});
		var _entities = {};
		var _stepLength = 1/60; //in seconds
		var _scheduledForDeletion = [];
		var _deleteEntities = function() {
				_.each(_scheduledForDeletion, function(id) {	
					// console.log("deleting= ", id);			
					delete _entities[id];
				});
				_scheduledForDeletion = [];
		};
		var _printEntityAndChildren = function( nTabs, entity, function_printEntityAndChildren ) {
			var s = '';
			for( var i = 0; i < nTabs; i++ )
				s += '	';
			console.log(s + '->' + entity.key);

			_.each(entity.childrenManager.getChildrenArray(), function(childEntity){
				function_printEntityAndChildren(nTabs+1, childEntity, function_printEntityAndChildren);
			}.bind(this));
		};

		_world.on("beginContact", function(event){
	        var bodyA = event.bodyA;
	        var bodyB = event.bodyB;
	        // console.log("Colliding %s %s with %s %s", bodyA.entity.key, bodyA.entity.id, bodyB.entity.id, bodyB.entity.key);

	        // console.log("Impacting!!");
	        bodyA.entity.collision(bodyB.entity);
	        bodyB.entity.collision(bodyA.entity);
   	 	});


		return {
			// Public properties and functions
			entities: _entities,
			world: _world,
			gameStep: function() {
				for (var i in _entities) {
					_entities[i].updateBeforeWorldStep();
				}
				// console.log("doing world step");
				_world.step(_stepLength);
				for (var i in _entities) {
					_entities[i].updateAfterWorldStep();
				}
				// console.log("deleting entities");
				_deleteEntities();
			},
			addEntity: function(entity, id) {
				// console.log("gameEngine addEntity");
				// console.log(entity);
				_entities[id] = entity;
			},
			deleteEntity: function(entity) {
				_scheduledForDeletion.push(entity.id);
			},
			printEntityHierarchy: function() {
				_.each(_entities, function(entity){
					if( !entity.father )
						_printEntityAndChildren(0, entity, _printEntityAndChildren);
				});
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