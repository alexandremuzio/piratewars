'use strict'

var Entity = require('../../shared/core/entity.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var SpriteComponent = require('../components/sprite.js');
var PhaserInputComponent = require('../components/input.js');
var SyncComponent = require('../components/sync.js');
var PlayerControllerComponent = require('../../shared/components/player_controller.js');
var GameEngine = require('../../shared/game_engine.js');
var NetworkComponent = require('../../shared/components/network.js');

///////////////////// Send these to a data file /////////////////////////////
var playerSpriteSize = 0.2;
var playerDamping = 0.95;
var playerAngularDamping = 0.95;
var playerMass = 1;

function EntityFactory(game, socket) {
	this.game = game;
	this.socket = socket;
}

EntityFactory.prototype.createLocalPlayer = function(data) {
	console.log("inside entity factory createLocalPlayer")
	var entity = new Entity(data.id);

	var sprite = this.game.add.sprite(100, 100, 'boat_0');
	sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
    sprite.scale.setTo(playerSpriteSize, playerSpriteSize);
    sprite.tint = 0xff6600;

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


	entity.components.add(new NetworkComponent(this.socket));
	entity.components.add(new SyncComponent());
	entity.components.add(new PhaserInputComponent(this.game.input));
	entity.components.add(new PhysicsComponent(body));
	entity.components.add(new SpriteComponent(sprite));
	entity.components.add(new PlayerControllerComponent());

	return entity;
}

EntityFactory.prototype.createRemotePlayer = function(data) {
	var entity = new Entity(data.id);

	var sprite = this.game.add.sprite(100, 100, 'boat_0');
	sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
    sprite.scale.setTo(playerSpriteSize, playerSpriteSize);
    sprite.tint = 0xff0066;

	var body = new p2.Body({
            name: "player",
            mass: playerMass,
            position: [100, 100]
        });
    body.addShape(new p2.Circle(this.radius));
    body.damping = playerDamping;
    body.angularDamping = playerAngularDamping;
    body.angle = 0;
	// GameEngine.getInstance().world.addBody(body);


	entity.components.add(new NetworkComponent(this.socket));
	entity.components.add(new PhysicsComponent(body));
	entity.components.add(new SpriteComponent(sprite));
	entity.components.add(new SyncComponent());
	entity.components.add(new PlayerControllerComponent());

	return entity;
}

module.exports = EntityFactory;