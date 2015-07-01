'use strict'

var p2 = require('p2');
var BulletComponent = require('../components/bullet.js');
var Entity = require('../../shared/core/entity.js');
var GameEngine = require('../../shared/game_engine.js');
var PhysicsComponent = require('../../shared/components/physics.js');
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

	createBullet : function(initialPosition, angle, id) {
		// console.log("createBullet");
		var bulletId = id;
		var entity = new Entity(bulletId, 'bullet');

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
		shape.sensor = true;
	    body.addShape(shape);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new BulletComponent());
		// console.log("End of entity");
		return entity;
	},

	createMine : function(id, initialPosition, initialAngle, initialVelocity) {
		var entity = new Entity(id, 'mine'),
        	entityGroup, sprites_info;

		var body = new p2.Body({
	            name: "mine",
	            type: p2.Body.KINEMATIC,
	            mass : mine_settings.physics.mass,
	            position: [initialPosition.x, initialPosition.y],
	            velocity: [initialVelocity.x, initialVelocity.y],
	            damping: mine_settings.physics.damping,
	            angularDamping: mine_settings.physics.angular_damping,
	            angularVelocity: mine_settings.physics.angular_velocity*( Math.random() > 0.5 ? 1 : -1)
	    });
	    body.entity = entity;
	    
	    var shape = new p2.Circle(mine_settings.radius); //////set radius!!
		shape.collisionGroup = MINE;
		shape.collisionMask = PLAYER;
	    // body.addShape(shape);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new MineController(shape));
		// console.log("End of entity");
		return entity;
	}

};

module.exports = ProjectileFactory;