'use strict'

var BulletComponent = require('../components/bullet.js');
var Entity = require('../../shared/core/entity.js');
var GameEngine = require('../../shared/game_engine.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var SpriteComponent = require('../components/sprite.js');
var UUID = require('node-uuid');
var MathUtils = require('../../shared/utils/math.js');

var bullet_settings = require('../../shared/settings/bullet.json');

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);
var STRONGHOLD = Math.pow(2,2);

var BulletFactory = {
	init : function (data) {
		this.game = data.game;
	},

	createBullet : function(initialPosition, angle) {
		// console.log("createBullet");
		var bulletId = UUID();
		var entity = new Entity(bulletId, 'bullet'),
            entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		sprites_info = {
			boat: {
				sprite: entityGroup.create(initialPosition.x, initialPosition.y, 'bullet'),
				scale: { 
	        		x: bullet_settings.radius,
	        		y: bullet_settings.radius
        		},
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		tint: 0xff6600
			}
		};
		
        var velocity = MathUtils.vector(bullet_settings.physics.velocity, angle);
		
		var body = new p2.Body({
	            name: "bullet",
	            type: p2.Body.KINEMATIC,
	            /*mass : bulletMass,*/
	            position: [initialPosition.x, initialPosition.y],
	            velocity: [ velocity.x, velocity.y ],
	    });
	    body.entity = entity;
	    
	    var shape = new p2.Circle(bullet_settings.radius);
		shape.collisionGroup = BULLET;
		shape.collisionMask = PLAYER | STRONGHOLD;
	    body.addShape(shape);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new BulletComponent());

		return entity;
	},

	createRemoteBullet : function(transform) {
		// console.log("createBullet");
		var bulletId = UUID();
		var entity = new Entity(bulletId),
		    entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		sprites_info = {
			boat: {
				sprite: entityGroup.create(transform.x, transform.y, 'bullet'),
				scale: { 
	        		x: bullet_settings.radius,
	        		y: bullet_settings.radius
        		},
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		tint: 0xff6600
			}
		};

		
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
	    
	    var shape = new p2.Circle(bullet_settings.radius);
		shape.collisionGroup = BULLET;
		shape.collisionMask = PLAYER | STRONGHOLD;
	    body.addShape(shape);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new BulletComponent());
		
        return entity;
	}
};

module.exports = BulletFactory;