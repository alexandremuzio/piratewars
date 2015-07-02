'use strict'

var _ = require('underscore');
var UUID = require('node-uuid');
var GameEngine = require('../../shared/game_engine.js');
var BulletComponent = require('../components/bullet.js');
var CooldownComponent = require('../../shared/components/cooldown.js');
var CreatorComponent = require('../components/creator.js');
var Entity = require('../../shared/core/entity.js');
var NetworkComponent = require('../../shared/components/network.js');
var PhaserInputComponent = require('../components/input.js');
var PhysicsComponent = require('../../shared/components/physics.js');
var PlayerControllerComponent = require('../components/player_controller.js');
var SpriteComponent = require('../components/sprite.js');
var SyncComponent = require('../components/sync.js');
var HealthBarComponent = require('../components/health_bar.js');
var TextComponent = require('../components/text.js');
var CannonsManagerController = require('../components/cannons_manager_controller.js');
var CannonController = require('../components/cannon_controller.js');
var HealthComponent = require('../components/health.js');
var MineGeneratorComponent = require('../components/mine_generator.js');
var StrongholdComponent = require('../components/stronghold');
var SelfPlayerStatesManagerComponent = require('../components/self_player_states_manager.js');

var stronghold_settings = require('../../shared/settings/stronghold.json');
var player_settings = require('../../shared/settings/player.json');
var mine_settings = require('../../shared/settings/mine.json');
var team_settings = require('../../shared/settings/teams.json');

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);
var STRONGHOLD = Math.pow(2,2);
var MINE = Math.pow(2,3);

var PlayerFactory = {
	init : function (data) {
		this.game = data.game;
		this.socket = data.socket;
	},

	//TODO pass the start position to the player
	createLocalPlayer : function(data) {
		console.log("inside entity factory createLocalPlayer")
		var entity = new Entity(data.id, "player"),
		    entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		var spriteName = _.findWhere(team_settings.teams, { name: data.initialAttrs.team }).sprite;
		var deadSpriteName = _.findWhere(team_settings.teams, { name: data.initialAttrs.team }).dead_sprite;

		sprites_info = {
			boat: {
        		sprite: entityGroup.create(data.transform.x, data.transform.y, spriteName),
				width: player_settings.width,
	        	height: player_settings.height,
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		// tint: data.initialAttrs.teamColor
			},
			dead_boat: {
				sprite: entityGroup.create(100, 100, deadSpriteName),
				width: player_settings.width,
	        	height: player_settings.height,
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		//tint: 
			}
		};

	    /* Player name, must be set by the user (MUST FIX) */
	    var text = this.game.add.text(0, 0, data.name, {
		        font: player_settings.text.font,
		        fill: player_settings.text.fill,
		        align: player_settings.text.allign
		    });
		text.anchor.setTo(0.5, 0.5);

		var body = new p2.Body({
	            name: "player",
	            mass: player_settings.physics.mass,
	            position: [data.transform.x, data.transform.y],
	            angle: 0,
	            damping: player_settings.physics.linear_damping,
	            angularDamping: player_settings.physics.angular_damping
	        });
		body.entity = entity;

		var shape = new p2.Rectangle(player_settings.width, player_settings.height - player_settings.lateral_offset);
		shape.collisionGroup = PLAYER;
		shape.collisionMask = PLAYER | STRONGHOLD | BULLET | MINE;
	    body.addShape(shape);

		entity.components.add(new HealthComponent(player_settings.maxHealth));
		entity.components.add(new CooldownComponent());
		entity.components.add(new CreatorComponent());
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new SyncComponent());
		entity.components.add(new PhaserInputComponent(this.game.input));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new PlayerControllerComponent());
		entity.components.add(new TextComponent(text));
		entity.components.add(new MineGeneratorComponent());
		entity.components.add(new SelfPlayerStatesManagerComponent(this.game));
		// Subentitys
		// Creating HealthBar subentity
		var healthBar = this.createHealthBar(data.id+'-health_bar',
										player_settings.health_bar.scale);

		// healthBar.setBaseEntity(entity, -healthBar.components.get('sprite').getSprite('blood').width/2,
		healthBar.setBaseEntity(entity, -player_settings.width / 2,
								-player_settings.height 
									- player_settings.health_bar.relativeYtoTop,
								0);
		healthBar.setFollowBaseEntityAngle(false);

		var cannonsManager = this.createCannonsManager(data.id+'-cannons_manager');
		cannonsManager.setBaseEntity(entity, 0, 0, 0);

		var mineStart = this.createEmptyEntity(data.id+'-mine_start', 'mine_start');
		mineStart.setBaseEntity(entity, mine_settings.launch_distance, 0, 0);

		return entity;
	},

	createHealthBar: function(id, scale) {
		var entity = new Entity(id, 'health_bar'),
		    entityGroup, sprites_info;

		// var scale = 1;

		entityGroup = this.game.add.group();

		sprites_info = {
			blood: {
        		sprite: entityGroup.create(205, 205, 'redbar'),
				scale: { 
	        		x: scale.x,
	        		y: scale.y
        		},
	        	anchor: {
	        		x: 0.0,
	        		y: 0.0
	        	},
        		// tint: data.initialAttrs.teamColor
			},
			outline: {
        		sprite: entityGroup.create(205, 205, 'blackbox'),
				scale: { 
	        		x: scale.x,
	        		y: scale.y
        		},
	        	anchor: {
	        		x: 0.0,
	        		y: 0.0
	        	},
        		// tint: data.initialAttrs.teamColor
			}
		};
				
	    entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new HealthBarComponent());

		return entity;
	},

	createCannonsManager : function(id) {
		var entity = new Entity(id, 'cannons_manager');

		var cannonsManagerController = new CannonsManagerController();
		entity.components.add(cannonsManagerController);

		// Creating cannons subentitys
		for( var i = 0; i < 3; i++ ){
			var cannon = this.createCannon(id+'-cannon_'+(i+1), 'cannon_'+(i+1));
			cannon.setBaseEntity(entity,
									player_settings.cannon.x0
									+ player_settings.cannon.xInterval*i,
									-player_settings.cannon.y0,
									-Math.PI/2);
			cannonsManagerController.addLeft(cannon);
		}
		for( var i = 0; i < 3; i++ ){
			var cannon = this.createCannon(id+'-cannon_'+(i+4), 'cannon_'+(i+4));
			cannon.setBaseEntity(entity,
							  		player_settings.cannon.x0
							  		+ player_settings.cannon.xInterval*i,
							  		player_settings.cannon.y0,
							  		Math.PI/2);
			cannonsManagerController.addRight(cannon);
		}

		return entity;
	},

	createCannon : function(id, key) {
		var entity = new Entity(id, key),
		    entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		// sprites_info = {
		// 	cannon: {
		// 		sprite: entityGroup.create(205, 100, 'cannon_0'),
		// 		scale: { 
	 //        		x: player_settings.cannon.scale.x,
	 //        		y: player_settings.cannon.scale.y
  //       		},
	 //        	anchor: {
	 //        		x: 0.5,
	 //        		y: 0.5
	 //        	},
  //       		//tint: 0xff6600
		// 	}
		// }			

		// entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new CannonController());

		// Creating bulletInitialTransform subentity
		var bulletStart = this.createEmptyEntity(id+'-bullet_start', 'bullet_start');
		bulletStart.setBaseEntity(entity,
								 player_settings.cannon.distFromCannon, 0, 0);

		return entity;
	},

	createEmptyEntity : function(id, key) {
		var entity = new Entity(id, key);
		return entity;
	},

	createRemotePlayer : function(data) {
		// console.log("inside entity factory createRemotePlayer");
		
		var entity = new Entity(data.id, "player"),
		    entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		var spriteName = _.findWhere(team_settings.teams, { name: data.initialAttrs.team }).sprite;
		var deadSpriteName = _.findWhere(team_settings.teams, { name: data.initialAttrs.team }).dead_sprite;

		sprites_info = {
			boat: {
				sprite: entityGroup.create(data.transform.x, data.transform.y, spriteName),
				width: player_settings.width,
	        	height: player_settings.height,
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		//tint: 0xff6600
			},
			dead_boat: {
				sprite: entityGroup.create(data.transform.x, data.transform.y, deadSpriteName),
				width: player_settings.width,
	        	height: player_settings.height,
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		//tint: 0xff6600
			}
		};

		var text = this.game.add.text(0, 0, data.name, {
		        font: player_settings.text.font,
		        fill: player_settings.text.fill,
		        align: player_settings.text.allign
		    });
		text.anchor.setTo(0.5, 0.5);

		var body = new p2.Body({
	            name: "player",
	            mass: player_settings.physics.mass,
	            position: [data.transform.x, data.transform.y]
	        });
		body.entity = entity;

		var shape = new p2.Rectangle(player_settings.width, player_settings.height - player_settings.lateral_offset);
		shape.collisionGroup = PLAYER;
		shape.collisionMask = PLAYER | STRONGHOLD | BULLET | MINE;
	    body.addShape(shape);

	    // body.damping = player_settings.physics.linear_damping;
    	// body.angularDamping = player_settings.physics.angular_damping
	    
	    entity.components.add(new HealthComponent(player_settings.maxHealth));
		entity.components.add(new CooldownComponent());
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new SyncComponent());
		entity.components.add(new TextComponent(text));
		entity.components.add(new PlayerControllerComponent());

		// Subentitys// Subentitys
		// Creating HealthBar subentity
		var healthBar = this.createHealthBar(data.id+'-health_bar',
										player_settings.health_bar.scale);
		healthBar.setBaseEntity(entity, -player_settings.width / 2,
								-player_settings.height 
									- player_settings.health_bar.relativeYtoTop,
								0);
		healthBar.setFollowBaseEntityAngle(false);
		
		var cannonsManager = this.createCannonsManager(data.id+'-cannons_manager')
		cannonsManager.setBaseEntity(entity, 0, 0, 0);

		return entity;
	},

	createStronghold : function(index) {
		var data = stronghold_settings.bases[index];

		var entity = new Entity(data.id, 'stronghold'),
		    entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		sprites_info = {
			stronghold: {
				sprite: entityGroup.create(data.initialPos.x, data.initialPos.y, 'stronghold'),
				width: stronghold_settings.width,
	        	height: stronghold_settings.height,
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		// tint: data.color
			}
		};

		var body = new p2.Body({
	            name: "stronghold",
	            mass: 99999999,
	            // type: p2.Body.STATIC,
	            position: [data.initialPos.x, data.initialPos.y]
	        });
		body.entity = entity;

	    var shape = new p2.Rectangle(stronghold_settings.width,
	    							 stronghold_settings.height);
	    shape.collisionGroup = STRONGHOLD;
		shape.collisionMask = PLAYER | BULLET;
		body.addShape(shape);

		entity.components.add(new HealthComponent(stronghold_settings.maxHealth));
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new SyncComponent());
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new StrongholdComponent());

		// Subentitys
		// Creating HealthBar subentity
		var healthBar = this.createHealthBar(data.id+'-health_bar',
		 								stronghold_settings.health_bar.scale);

		//Improve this, doing in the wrong way
		if(index == 0) {
			healthBar.setBaseEntity(entity, -healthBar.components.get('sprite').getSprite('blood').width/2,
									-stronghold_settings.height / 2
										- stronghold_settings.health_bar.relativeYtoTop,
									0);
		}
		else {
			healthBar.setBaseEntity(entity, -healthBar.components.get('sprite').getSprite('blood').width/2,
									stronghold_settings.height / 2
										+ stronghold_settings.health_bar.relativeYtoBottom,
									0);
		}
		healthBar.setFollowBaseEntityAngle(false);

		return entity;
	}
};

module.exports = PlayerFactory;