'use strict';

var p2 = require('p2');
var BulletComponent = require('../components/bullet.js');
var Entity = require('../../shared/core/entity.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var UUID = require('node-uuid');
var MathUtils = require('../../shared/utils/math.js');
var MineController = require('../components/mine_controller.js');
var MineCollisionDetector = require('../components/mine_collision_manager.js');

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

	createBullet : function(initialPosition, initialVelocity, angle, id) {
		// console.log("createBullet");
		var bulletId = id;
		var entity = new Entity(bulletId, 'bullet');

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
		entity.components.add(new BulletComponent());
		// console.log("End of entity");
		return entity;
	},

	createMine : function(id, mineKey,initialPosition, initialAngle, initialVelocity, base) {
		var entity = new Entity(id, mineKey);
		// console.log('base: ' + base);
		entity.setBaseEntity(base);

		var body = new p2.Body({
	            name: "mine",
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
		shape.sensor = true;
	    body.addShape(shape);

		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new MineController());
		// console.log("End of entity");
		return entity;
	},

	createMineCollisionManager : function() {
		var entity = new Entity(UUID(), 'mine_collision_manager');
	    
		entity.components.add(new MineCollisionDetector());

		return entity;
	}
};

module.exports = ProjectileFactory;