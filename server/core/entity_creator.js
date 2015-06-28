'use strict'

var p2 = require('p2');
var UUID = require('node-uuid');
var GameEngine = require('../../shared/game_engine.js');
var Entity = require('../../shared/core/entity.js');
var BulletComponent = require('../components/bullet.js');
var PhysicsComponent = require('../../shared/components/physics.js');

///////////////////// Send these to a data file /////////////////////////////
var bulletVelocity = 500;
var bulletSpriteScale = 0.2;
var bulletMass = 0.00002;

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);
var STRONGHOLD = Math.pow(2,2);

var EntityCreator = {
	init : function (game) {
		this.game = game;
	},

	createBullet : function(player, cannonPosition, side, UUID) {
		// console.log("createBullet");
		var bulletId = UUID;
		var entity = new Entity(bulletId, 'bullet');

		//CHANGE TO GET FROM TRANSFORM//////////
		var playerBody = player.components.get("physics").body;
		//bullet properties
		var x = cannonPosition.x;
		var y = cannonPosition.y;

		var angle;
		if (side == "left")  angle = playerBody.angle - 90;
		else angle = playerBody.angle + 90;

		var body = new p2.Body({
	            name: "bullet",
	            type: p2.Body.KINEMATIC,
	            // mass: 0,
	            position: [x, y],
	            velocity: [bulletVelocity *  Math.cos(angle *  Math.PI/ 180.0),
	            		   bulletVelocity *  Math.sin(angle *  Math.PI/ 180.0)]
	    });
	    body.entity = entity;

		var shape = new p2.Circle(3); //////set radius!!
		shape.collisionGroup = BULLET;
		shape.collisionMask = PLAYER | STRONGHOLD;
		shape.sensor = true;
		body.addShape(shape);
		body.angle = angle;

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new BulletComponent(player.id));
		return entity;
	}
};

module.exports = EntityCreator;