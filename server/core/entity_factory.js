'use strict'

var UUID = require('node-uuid');
var Entity = require('../../shared/core/entity');
var PlayerComponent = require('../../shared/components/player');
var NetworkComponent = require('../../shared/components/network');

//singleton
var EntityFactory = {createPlayer: null};

EntityFactory.createPlayer = function(socket) {
	var id = UUID();
	var entity = new Entity(id);

	// var body = new p2.Body({
 //            name: "player",
 //            mass: playerMass,
 //            position: [100, 100]
 //        });
 //    body.addShape(new p2.Circle(this.radius));
 //    body.damping = playerDamping;
 //    body.angularDamping = playerAngularDamping;
 //    body.angle = 0;
	// GameEngine.getInstance().world.addBody(body);

	// entity.components.add(new PhysicsComponent(body));
	// entity.components.add(new SpriteComponent(sprite));
	// entity.components.add(new PhaserInputComponent(this.game.input));
	// entity.components.add(new SyncComponent());
	entity.components.add(new PlayerComponent());
	entity.components.add(new NetworkComponent(socket));

	return entity;
}


module.exports = EntityFactory;