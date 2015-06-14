'use strict'

var UUID = require('node-uuid');
var p2 = require('p2');
var Entity = require('../../shared/core/entity.js');
var CooldownComponent = require('../../shared/components/cooldown');
var CreatorComponent = require('../components/creator');
var CannonComponent = require('../../shared/components/cannon');
var PlayerControllerComponent = require('../components/player_controller');
var NetworkComponent = require('../../shared/components/network.js');
var ServerInputComponent = require('../components/input.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var GameEngine = require('../../shared/game_engine.js');

///////////////////// Send these to a data file /////////////////////////////
var playerSpriteSize = 0.2;
var playerDamping = 0;
var playerAngularDamping = 0;
var playerMass = 1;

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);


//static class
var EntityFactory = {
	createPlayer : function(data) {
		var id = UUID();
		var entity = new Entity(id, 'player');

		var body = new p2.Body({
	            name: "player",
	            mass: playerMass,
	            position: [100, 100]
	        });
		body.entity = entity;

	    var shape = new p2.Rectangle(80, 40); ////change to correct size
	    shape.collisionGroup = PLAYER;
		shape.collisionMask = BULLET | PLAYER;
		body.addShape(shape);
		
	    body.damping = playerDamping;
	    body.angularDamping = playerAngularDamping;
	    body.angle = 0;
		GameEngine.getInstance().world.addBody(body);

		entity.components.add(new CooldownComponent());
		entity.components.add(new NetworkComponent(data.socket));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new ServerInputComponent(data.snapshots));
		entity.components.add(new PlayerControllerComponent());
		entity.components.add(new CannonComponent());
		entity.components.add(new CreatorComponent());

		return entity;
	}
}

module.exports = EntityFactory;