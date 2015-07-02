'use strict'

var BulletComponent = require('../components/bullet.js');
var Entity = require('../../shared/core/entity.js');
var GameEngine = require('../../shared/game_engine.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var SpriteComponent = require('../components/sprite.js');
var UUID = require('node-uuid');
var MathUtils = require('../../shared/utils/math.js');
var MineController = require('../components/mine_controller.js');

var mine_settings = require('../../shared/settings/mine.json');
var bullet_settings = require('../../shared/settings/bullet.json');

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);
var STRONGHOLD = Math.pow(2,2);
var MINE = Math.pow(2,3);

var ProjectileFactory = {
	init : function (data) {
		this.game = data.game;
	},

	createBullet : function(initialPosition, initialVelocity, angle) {
		// console.log("createBullet");
		var bulletId = UUID();
		var entity = new Entity(bulletId, 'bullet'),
            entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		sprites_info = {
			boat: {
				sprite: entityGroup.create(initialPosition.x, initialPosition.y, 'bullet'),
				width: bullet_settings.radius,
				height: bullet_settings.radius,
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		//tint: 0xff6600
			}
		};
		
        var bulletVelocity = MathUtils.vector(bullet_settings.physics.velocity, angle);

		var body = new p2.Body({
	            name: "bullet",
	            type: p2.Body.KINEMATIC,
	            /*mass : bulletMass,*/
	            position: [initialPosition.x, initialPosition.y],
	            velocity: [ bulletVelocity.x + initialVelocity[0],
	            		    bulletVelocity.y + initialVelocity[1]],
	    });
	    body.entity = entity;
	    
	    var shape = new p2.Circle(bullet_settings.radius);
		shape.collisionGroup = BULLET;
		shape.collisionMask = PLAYER | STRONGHOLD;
		shape.sensor = true;
	    body.addShape(shape);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprites_info));
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
				width: bullet_settings.radius,
				height: bullet_settings.radius,
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		//tint: 0xff6600
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
		shape.sensor = true;
	    body.addShape(shape);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new BulletComponent());

        return entity;
	},

	createMine : function(id, mineKey,initialPosition, initialAngle, initialVelocity) {
		var entity = new Entity(id, mineKey),
        	entityGroup, sprites_info;

        // console.log(this);
        // console.log(this.game);

		entityGroup = this.game.add.group();

		sprites_info = {
			mine: {
				sprite: entityGroup.create(initialPosition.x, initialPosition.y, 'mine'),
				width: mine_settings.radius,
				height: mine_settings.radius,
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		//tint: 0xff6600
			}
		};

		var body = new p2.Body({
	            name: "mine",
	            mass : mine_settings.physics.mass,
	            position: [initialPosition.x, initialPosition.y],
	            velocity: [initialVelocity.x, initialVelocity.y],
	            damping: mine_settings.physics.damping,
	            angularDamping: mine_settings.physics.angular_damping,
	            angularVelocity: mine_settings.physics.angular_velocity*( Math.random() > 0.5 ? 1 : -1),
	    });
	    body.entity = entity;
	    // body.collisionResponse = false;

	    // console.log('Created body of mine:');
	    // console.log(body);
	    
	    var shape = new p2.Circle(mine_settings.radius); //////set radius!!
		shape.collisionGroup = MINE;
		shape.collisionMask = PLAYER;
		shape.sensor = true;
	    body.addShape(shape);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new MineController());
		entity.components.add(new SpriteComponent(sprites_info));
		// console.log("End of entity");
		return entity;
	},

	createRemoteMine : function(transform) {
		var id = transform.id;
		var entity = new Entity(id, 'mine'),
        	entityGroup, sprites_info;

        // console.log(this);
        // console.log(this.game);

		entityGroup = this.game.add.group();

		sprites_info = {
			mine: {
				sprite: entityGroup.create(transform.position.x, transform.position.y, 'mine'),
				width: mine_settings.radius,
				height: mine_settings.radius,
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		//tint: 0xff6600
			}
		};

		var body = new p2.Body({
	            name: "mine",
	            mass : mine_settings.physics.mass,
	            position: [transform.position.x, transform.position.y],
	            velocity: [transform.velocity.x, transform.velocity.y],
	            damping: mine_settings.physics.damping,
	            angularDamping: mine_settings.physics.angular_damping,
	            angularVelocity: mine_settings.physics.angular_velocity*( Math.random() > 0.5 ? 1 : -1),
	    });
	    body.entity = entity;
	    // body.collisionResponse = false;

	    var shape = new p2.Circle(mine_settings.radius); //////set radius!!
		shape.collisionGroup = MINE;
		shape.collisionMask = PLAYER;
		shape.sensor = true;
	    body.addShape(shape);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new MineController());
		entity.components.add(new SpriteComponent(sprites_info));
		// console.log("End of entity");
		// console.log(entity);

		return entity;
	}
};

module.exports = ProjectileFactory;