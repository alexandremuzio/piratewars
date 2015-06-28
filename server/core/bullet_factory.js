'use strict'

var p2 = require('p2');
var BulletComponent = require('../components/bullet.js');
var Entity = require('../../shared/core/entity.js');
var GameEngine = require('../../shared/game_engine.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var UUID = require('node-uuid');
var MathUtils = require('../../shared/utils/math.js');

///////////////////// Send these to a data file /////////////////////////////
var bulletVelocity = 50;
var bulletSpriteScale = 0.2;
var bulletMass = 0.2;

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);

var BulletFactory = {
	init : function (data) {
		this.game = data.game;
	},

	createBullet : function(initialPosition, angle) {
		// console.log("createBullet");
		var bulletId = UUID();
		var entity = new Entity(bulletId, 'bullet');

		var velocity = MathUtils.vector(bulletVelocity, angle);

		var body = new p2.Body({
	            name: "bullet",
	            type: p2.Body.KINEMATIC,
	            /*mass : bulletMass,*/
	            position: [initialPosition.x, initialPosition.y],
	            velocity: [ velocity.x, velocity.y ],
	    });
	    body.entity = entity;
	    
	    var shape = new p2.Circle(1); //////set radius!!
		shape.collisionGroup = BULLET;
		shape.collisionMask = PLAYER;
	    body.addShape(shape);

		GameEngine.getInstance().world.addBody(body);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new BulletComponent());
		// console.log("End of entity");
		return entity;
	},
};

module.exports = BulletFactory;