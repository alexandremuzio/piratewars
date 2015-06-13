'use strict'

var GameEngine = require('../../shared/game_engine.js');

var BulletComponent = require('../../shared/components/bullet.js');
var CreatorComponent = require('../components/creator.js');
var Entity = require('../../shared/core/entity.js');
var NetworkComponent = require('../../shared/components/network.js');
var PhaserInputComponent = require('../components/input.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var PlayerControllerComponent = require('../../shared/components/player_controller.js');
var SpriteComponent = require('../components/sprite.js');
var SyncComponent = require('../components/sync.js');

///////////////////// Send these to a data file /////////////////////////////
var playerSpriteSize = 0.2;
var playerDamping = 0.95;
var playerAngularDamping = 0.95;
var playerMass = 1;

var EntityFactory = {
	init: null,
	createLocalPlayer: null,
	createRemotePlayer: null,
	createBullet: null,
	createTest: "hello"
}

EntityFactory.init = function(data) {
	this.game = data.game;
	this.socket= data.socket;
};

EntityFactory.createLocalPlayer = function(data) {
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
	entity.components.add(new CreatorComponent());

	return entity;
}

EntityFactory.createRemotePlayer = function(data) {
	console.log("inside entity factory createRemotePlayer");
	
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
	entity.components.add(new CreatorComponent());

	return entity;
}

EntityFactory.createBullet = function(player) {
	console.log("createBullet");
	var bulletId = UUID();
	var entity = new Entity(bulletId);

	//bullet properties
	var x = player.transform.position.x;
	var y = player.transform.position.y;
	var angle = player.transform.angle - 90; ////// degrees??

	var sprite = this.game.add.sprite(x, y, 'bullet');
	sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
	sprite.scale.setTo(bulletSpriteSize);

	var body = new p2.Body({
            name: "player",
            mass: playerMass,
            position: [x, y],
            velocity: [bulletVelocity *  Math.cos(angle *  Math.PI/ 180.0),
            		   bulletVelocity *  Math.sin(angle *  Math.PI/ 180.0)]
    });
	body.addShape(new p2.Circle(this.radius));
	body.angle = angle;

	entity.component.add(new PhysicsComponent(body));
	entity.component.add(new SpriteComponent(sprite));
	entity.component.add(new BulletComponent(player.id));

	return entity;
}

module.exports = EntityFactory;