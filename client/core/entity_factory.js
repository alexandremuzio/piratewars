'use strict'

var Entity = require('../../shared/core/entity.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var SpriteComponent = require('../components/sprite.js');
var PhaserInputComponent = require('../components/input.js');
var PlayerComponent = require('../../shared/components/player.js');
var GameEngine = require('../../shared/game_engine.js');

function EntityFactory(game) {
	this.game = game;
}

EntityFactory.prototype.createLocalPlayer = function(data) {
	var entity = new Entity();

	var sprite = this.game.add.sprite(100, 100, 'boat_0');
	sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
    sprite.scale.setTo(0.5, 0.5);
    sprite.tint = 0xff6600;

	var body = new p2.Body({
            name: "player",
            mass: 1,
            position: [100, 100]
        });
    body.addShape(new p2.Circle(this.radius));
    body.damping = 0.95;
    body.angularDamping = 0.95;
    body.angle = 0;
	GameEngine.getInstance().world.addBody(body);

	entity.components.add(new PhysicsComponent(body));
	entity.components.add(new SpriteComponent(sprite));
	entity.components.add(new PhaserInputComponent(this.game.input));
	entity.components.add(new PlayerComponent());

	return entity;
}

module.exports = EntityFactory;