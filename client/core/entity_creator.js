'use strict'

var BulletComponent = require('../components/bullet.js');
var Entity = require('../../shared/core/entity.js');
var GameEngine = require('../../shared/game_engine.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var SpriteComponent = require('../components/sprite.js');
var UUID = require('node-uuid');

///////////////////// Send these to a data file /////////////////////////////
var bulletVelocity = 50;
var bulletSpriteScale = 0.2;
var bulletMass = 0.2;

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);
var STRONGHOLD = Math.pow(2,2);

var EntityCreator = {
	init : function (data) {
		this.game = data.game;
	},

	createBullet : function(player, cannonPosition, side) {
		// console.log("createBullet");
		var bulletId = UUID();
		var entity = new Entity(bulletId);

		//CHANGE TO GET FROM TRANSFORM//////////
		var playerBody = player.components.get("physics").body;
		//bullet properties
		var x = cannonPosition.x;
		var y = cannonPosition.y;

		var angle;
		if (side == "left")  angle = playerBody.angle - 90;
		else angle = playerBody.angle + 90;

		var sprite = this.game.add.sprite(x, y, 'bullet');
		sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
		sprite.scale.setTo(bulletSpriteScale);

		var body = new p2.Body({
	            name: "bullet",
	            type: p2.Body.KINEMATIC,
	            /*mass : bulletMass,*/
	            position: [x, y],
	            velocity: [bulletVelocity *  Math.cos(angle *  Math.PI/ 180.0),
	            		   bulletVelocity *  Math.sin(angle *  Math.PI/ 180.0)],
	    });
	    body.entity = entity;
	    
	    var shape = new p2.Circle(1); //////set radius!!
		shape.collisionGroup = BULLET;
		shape.collisionMask = PLAYER | STRONGHOLD;
	    body.addShape(shape);

		body.angle = angle;
		GameEngine.getInstance().world.addBody(body);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new BulletComponent(player.id));
		// console.log("End of entity");
		return entity;
	},

	createRemoteBullet : function(transform) {
		// console.log("createBullet");
		var bulletId = UUID();
		var entity = new Entity(bulletId);

		var sprite = this.game.add.sprite(transform.x, transform.y, 'bullet');
		sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
		sprite.scale.setTo(bulletSpriteScale);

		var body = new p2.Body({
	            name: "bullet",
	            type: p2.Body.KINEMATIC,
	            /*mass : bulletMass,*/
	            position: [transform.position.x,
	            		   transform.position.y],
	            velocity: [transform.velocity.x,
	            		   transform.velocity.y],
	            angle: transform.angle
	    });
	    body.entity = entity;
	    
	    var shape = new p2.Circle(1); //////set radius!!
		shape.collisionGroup = BULLET;
		shape.collisionMask = PLAYER;
	    body.addShape(shape);

		GameEngine.getInstance().world.addBody(body);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new BulletComponent());
		// console.log("End of entity");
		return entity;
	}
};

module.exports = EntityCreator;