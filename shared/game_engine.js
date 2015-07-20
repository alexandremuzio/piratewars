'use strict';

var p2 = require('p2');
var _ = require('underscore');

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
					// console.log('deleting= ', id);			
					delete _entities[id];
				});
				_scheduledForDeletion = [];
		};
		var _printEntityAndSubentitys = function( nTabs, entity, function_printEntityAndSubentitys ) {
			var s = '';
			for( var i = 0; i < nTabs; i++ )
				s += '	';
			console.log(s + '->' + entity.key);

			_.each(entity.subentityManager.getAll(), function(subentity){
				function_printEntityAndSubentitys(nTabs+1, subentity, function_printEntityAndSubentitys);
			}.bind(this));
		};

		_world.on('beginContact', function(event){
	        var bodyA = event.bodyA;
	        var bodyB = event.bodyB;
	        // console.log('Colliding %s %s with %s %s', bodyA.entity.key, bodyA.entity.id, bodyB.entity.id, bodyB.entity.key);

	        // console.log('Impacting!!');
	        if (bodyA.entity) {
	        	bodyA.entity.collision(bodyB.entity);
	        }
	        if (bodyB.entity) {
	        	bodyB.entity.collision(bodyA.entity);
	        }
   	 	});

		// Adding boundary lines to the map
	 	var top = new p2.Body({
	        angle: 0
	    });
	    var left = new p2.Body({
	        angle: Math.PI * 3 / 2
	    });
	    var bottom = new p2.Body({
	        position: [0, 2000],
	        angle: Math.PI
	    });
	    var right = new p2.Body({
	        position: [2000, 0],
	        angle: Math.PI / 2
	    });
	    top.addShape(new p2.Plane());
	    left.addShape(new p2.Plane());
	    bottom.addShape(new p2.Plane());
	    right.addShape(new p2.Plane());
	    _world.addBody(top);
	    _world.addBody(left);
	    _world.addBody(bottom);
	    _world.addBody(right);


		return {
			// Public properties and functions
			entities: _entities,
			world: _world,
			gameStep: function() {
				for (var i in _entities) {
					_entities[i].updateBeforeWorldStep();
				}
				// console.log('doing world step');
				_world.step(_stepLength);
				for (var i in _entities) {
					_entities[i].updateAfterWorldStep();
				}
				// console.log('deleting entities');
				_deleteEntities();
			},
			addEntity: function(entity, id) {
				// console.log('gameEngine addEntity');
				// console.log(entity);
				_entities[id] = entity;
			},
			deleteEntity: function(entity) {
				_scheduledForDeletion.push(entity.id);
			},
			printEntityHierarchy: function() {
				console.log('-------- Printing Entity Hierarchy --------');
				_.each(_entities, function(entity){
					if( !entity.baseEntity )
						_printEntityAndSubentitys(0, entity, _printEntityAndSubentitys);
				});
			}
		};
	}
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