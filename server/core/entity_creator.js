'use strict'

var p2 = require('p2');
var UUID = require('node-uuid');
var GameEngine = require('../../shared/game_engine.js');
var Entity = require('../../shared/core/entity.js');
var BulletComponent = require('../../shared/components/bullet.js');
var PhysicsComponent = require('../../shared/components/physics.js');

///////////////////// Send these to a data file /////////////////////////////
var bulletVelocity = 100;
var bulletSpriteScale = 0.2;
var bulletMass = 0.2;

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);

var EntityCreator = {
	init : function (game) {
		this.game = game;
	},

	createBullet : function(player, canonPosition, side) {
		console.log("createBullet");
		var bulletId = UUID();
		var entity = new Entity(bulletId);

		//CHANGE TO GET FROM TRANSFORM//////////
		var playerBody = player.components.get("physics").body;
		//bullet properties
		var x = canonPosition.x;
		var y = canonPosition.y;
		var angle;
		if (side == "left")  angle = playerBody.angle - 90;
		else angle = playerBody.angle + 90;

		var body = new p2.Body({
	            name: "bullet",
	            mass: bulletMass,
	            position: [x, y],
	            velocity: [bulletVelocity *  Math.cos(angle *  Math.PI/ 180.0),
	            		   bulletVelocity *  Math.sin(angle *  Math.PI/ 180.0)]
	    });
		var shape = new p2.Circle(1); //////set radius!!
		shape.collisionGroup = BULLET;
		shape.collisionMask = PLAYER;
		body.angle = angle;
		GameEngine.getInstance().world.addBody(body);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new BulletComponent(player.id));
		return entity;
	}
};

module.exports = EntityCreator;