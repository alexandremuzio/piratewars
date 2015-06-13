'use strict'

var UUID = require('node-uuid');
var p2 = require('p2');
var Entity = require('../../shared/core/entity.js');
var PlayerControllerComponent = require('../../shared/components/player_controller.js');
var NetworkComponent = require('../../shared/components/network.js');
var SyncComponent = require('../../shared/components/sync.js');
var ServerInputComponent = require('../components/input.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var GameEngine = require('../../shared/game_engine.js');

///////////////////// Send these to a data file /////////////////////////////
var playerSpriteSize = 0.2;
var playerDamping = 0.95;
var playerAngularDamping = 0.95;
var playerMass = 1;

//singleton
var EntityFactory = {createPlayer: null};

EntityFactory.createPlayer = function(data) {
	var id = UUID();
	var entity = new Entity(id);

	var body = new p2.Body({
            name: "player",
            mass: playerMass,
            position: [100, 100]
        });
    body.addShape(new p2.Circle(this.radius));
    body.damping = playerDamping;
    body.angularDamping = playerAngularDamping;
    body.angle = 0;
	GameEngine.getInstance().world.addBody(body);

	entity.components.add(new NetworkComponent(data.socket));
	entity.components.add(new PhysicsComponent(body));
	entity.components.add(new ServerInputComponent(data.snapshots));
	entity.components.add(new PlayerControllerComponent());

	return entity;
}


module.exports = EntityFactory;