'use strict'

var UUID = require('node-uuid');
var p2 = require('p2');
var Entity = require('../../shared/core/entity.js');
var CooldownComponent = require('../../shared/components/cooldown');
var CreatorComponent = require('../components/creator');
var PlayerControllerComponent = require('../components/player_controller');
var NetworkComponent = require('../../shared/components/network.js');
var ServerInputComponent = require('../components/input.js');
var PlayerStatesManagerComponent = require('../components/player_states_manager.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var GameEngine = require('../../shared/game_engine.js');
var StrongholdComponent = require('../components/stronghold');
var CannonsManagerController = require('../components/cannons_manager_controller.js');
var CannonController = require('../components/cannon_controller');
var HealthComponent = require('../components/health');

var player_settings = require('../../shared/settings/player.json');
var stronghold_settings = require('../../shared/settings/stronghold.json');

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);
var STRONGHOLD = Math.pow(2,2);

//static class
var PlayerFactory = {
	createPlayer : function(data) {
		var id = UUID();
		var entity = new Entity(id, 'player');

		var body = new p2.Body({
	            name: "player",
	            mass: player_settings.physics.mass,
	            position: [100, 100]
	        });
		body.entity = entity;

	    var shape = new p2.Rectangle(player_settings.width, player_settings.height);
	    shape.collisionGroup = PLAYER;
		shape.collisionMask = PLAYER | STRONGHOLD | BULLET;
		body.addShape(shape);
		
	    // body.damping = player_settings.physics.linear_damping;
    	// body.angularDamping = player_settings.physics.angular_damping;
	    body.angle = 0;

	    entity.components.add(new HealthComponent(player_settings.maxHealth));
		entity.components.add(new CreatorComponent());
		entity.components.add(new CooldownComponent());
		entity.components.add(new NetworkComponent(data.socket));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new ServerInputComponent(data.snapshots));
		entity.components.add(new PlayerControllerComponent());
		entity.components.add(new PlayerStatesManagerComponent());
		
		// Subentitys
		// Creating HealthBar subentity
		// var healthBar = this.createHealthBar(id+'health_bar');
		// healthBar.setBaseEntity(entity, 0, -30, 0);
		// healthBar.setFollowFatherAngle(false);

		var cannonsManager = this.createCannonsManager(id+'-cannons_manager')
		cannonsManager.setBaseEntity(entity, 0, 0, 0);

		return entity;
	},

	createCannonsManager : function(id) {
		var entity = new Entity(id, 'cannons_manager');

		var cannonsManagerController = new CannonsManagerController();
		entity.components.add(cannonsManagerController);

		// Cannons parameters
		var x0 = -20;
		var y0 = 8;
		var xInterval = 15;
		// Creating cannons subentitys
		for( var i = 0; i < 3; i++ ){
			var cannon = this.createCannon(id+'-cannon_'+(i+1), 'cannon_'+(i+1));
			cannon.setBaseEntity(entity, x0 + xInterval*i, -y0, -90);
			cannonsManagerController.addLeft(cannon);
		}
		for( var i = 0; i < 3; i++ ){
			var cannon = this.createCannon(id+'-cannon_'+(i+4), 'cannon_'+(i+4));
			cannon.setBaseEntity(entity, x0 + xInterval*i, y0, 90);
			cannonsManagerController.addRight(cannon);
		}

		return entity;
	},

	createCannon : function(id, key) {
		var entity = new Entity(id, key);

		entity.components.add(new CannonController());

		// Creating bulletStart subentity
		var bulletStart = this.createEmptyEntity(id+'-bullet_start', 'bullet_start');
		bulletStart.setBaseEntity(entity, 15, 0, 0);

		return entity;
	},

	createEmptyEntity : function(id, key) {
		var entity = new Entity(id, key);
		return entity;
	},

	createStronghold : function(index) {
		var data = stronghold_settings.bases[index];

		var entity = new Entity(data.id, 'stronghold');

		var body = new p2.Body({
	            name: "stronghold",
	            type: p2.Body.STATIC,
	            position: [data.initialPos.x, data.initialPos.y]
	        });
		body.entity = entity;

	    var shape = new p2.Rectangle(data.width, data.height);
	    shape.collisionGroup = STRONGHOLD;
		shape.collisionMask = PLAYER | BULLET;
		body.addShape(shape);
	    body.angle = 0;

	    entity.components.add(new HealthComponent(stronghold_settings.maxHealth));
		entity.components.add(new NetworkComponent(data.socket));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new StrongholdComponent());

		return entity;
	}
}

module.exports = PlayerFactory;