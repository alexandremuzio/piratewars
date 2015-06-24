'use strict'

var UUID = require('node-uuid');
var GameEngine = require('../../shared/game_engine.js');
var BulletComponent = require('../components/bullet.js');
var CannonComponent = require('../../shared/components/cannon.js');
var CooldownComponent = require('../../shared/components/cooldown.js');
var BaseManagerComponent = require('../../shared/components/base.js');
var LifeComponent = require('../../shared/components/life.js');
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

var physics_settings = require('../../shared/settings/boats/default_boat/physics.json');
///////////////////// Send these to a data file /////////////////////////////
var playerSpriteSize = 0.2;
var textSize = 0.2;
var healthBarSpriteSize = 0.2;
var baseSpriteSize = 1;

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);

var EntityFactory = {
	init : function (data) {
		this.game = data.game;
		this.socket = data.socket;
	},

	createLocalPlayer : function(data) {
		console.log("inside entity factory createLocalPlayer")
		var entity = new Entity(data.id),
		    entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		console.log('Antes de sprites_info');
		sprites_info = {
			boat: {
        		sprite: entityGroup.create(100, 100, 'boat_0'),
				scale: { 
	        		x: playerSpriteSize,
	        		y: playerSpriteSize
        		},
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		tint: 0xff6600
			}
		};
		console.log(sprites_info);
		//sprites['boat'].anchor.setTo(0.5, 0.5); // Default anchor at the center
	    //sprites['boat'].scale.setTo(playerSpriteSize, playerSpriteSize);
	    //sprites[boat].tint = 0xff6600;
	    
	    /* Player name, must be set by the user (MUST FIX) */
	    var text = this.game.add.text(0, 0, "Edgar Yano", {
		        font: "12px Arial",
		        fill: "#ff0044",
		        align: "center"
		    });
		text.anchor.setTo(0.5, 0.5);

		var body = new p2.Body({
	            name: "player",
	            mass: physics_settings.mass,
	            position: [100, 100]
	        });
		body.entity = entity;

		/// FIX IT !!!
		var shape = new p2.Rectangle(1.0, 1.0);
		//var shape = new p2.Rectangle(sprite.width, sprite.height);
		shape.collisionGroup = PLAYER;
		shape.collisionMask = PLAYER;
	    body.addShape(shape);
	    body.damping = physics_settings.linear_damping;
    	body.angularDamping = physics_settings.angular_damping
	    body.angle = 0;
		GameEngine.getInstance().world.addBody(body);

		entity.components.add(new CooldownComponent());
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new SyncComponent());
		entity.components.add(new PhaserInputComponent(this.game.input));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new PlayerControllerComponent());
		entity.components.add(new TextComponent(text));
		entity.components.add(new CannonComponent(entity));
		entity.components.add(new CreatorComponent());
		entity.components.add(new LifeComponent());

		this.createHealthBar(entity);
		return entity;
	},

	createRemotePlayer : function(data) {
		// console.log("inside entity factory createRemotePlayer");
		
		var entity = new Entity(data.id),
		    entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		sprites_info = {
			boat: {
				sprite: entityGroup.create(100, 100, 'boat_0'),
				scale: { 
	        		x: playerSpriteSize,
	        		y: playerSpriteSize
        		},
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		tint: 0xff6600
			}
		};

		var body = new p2.Body({
	            name: "player",
	            mass: physics_settings.mass,
	            position: [100, 100]
	        });
		body.entity = entity;

		/// FIX IT !!!
		var shape = new p2.Rectangle(1.0, 1.0);
		//var shape = new p2.Rectangle(sprite.width, sprite.height);
		shape.collisionGroup = PLAYER;
		shape.collisionMask = PLAYER;
	    body.addShape(shape);
	    body.damping = physics_settings.linear_damping;
    	body.angularDamping = physics_settings.angular_damping
	    body.angle = 0;
		GameEngine.getInstance().world.addBody(body);

		entity.components.add(new CooldownComponent());
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new SyncComponent());
		entity.components.add(new PlayerControllerComponent());
		entity.components.add(new CannonComponent());
		entity.components.add(new CreatorComponent());
		entity.components.add(new LifeComponent());
		
		return entity;
	},

	createBase: function(data) {
		var entity = new Entity(data.id),
		    entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		sprites_info = {
			boat: {
				sprite: entityGroup.create(100, 100, 'boat_0'),
				scale: { 
	        		x: baseSpriteSize,
	        		y: baseSpriteSize
        		},
	        	anchor: {
	        		x: 0.5,
	        		y: 0.5
	        	},
        		tint: 0xff6600
			}
		};

		entity.components.add(new BaseManagerComponent());
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SyncComponent());
		entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new LifeComponent());

		return entity;
	},

	createHealthBar: function(player) {
		/* GameEngine needs an ID, now is set randomly */
		var entity = new Entity(UUID()),
		    entityGroup, sprites_info;

		entityGroup = this.game.add.group();

		sprites_info = {
			blood: {
        		sprite: entityGroup.create(205, 205, 'redbar'),
				scale: { 
	        		x: healthBarSpriteSize,
	        		y: healthBarSpriteSize
        		},
	        	anchor: {
	        		x: 0.0,
	        		y: 0.0
	        	},
        		tint: 0xff6600
			},
			outline: {
        		sprite: entityGroup.create(205, 205, 'blackbox'),
				scale: { 
	        		x: healthBarSpriteSize,
	        		y: healthBarSpriteSize
        		},
	        	anchor: {
	        		x: 0.0,
	        		y: 0.0
	        	},
        		tint: 0xff6600
			}
		};
		
		//var referenceBody = player.components.get("physics").body;
		//var referenceSprite = player.components.get("sprite").sprite;
		//var referenceHeight = player.components.get("sprite").getHeight();
		
	    var body = new p2.Body({
				name: "healthBar",
				mass: 0, /* STATIC body */
				
				//Position must be in the right distance from reference (player)
				position: [200, 200]
				//position: [referenceBody.position[0] - inside.width/2.0, referenceBody.position[1] - 0.5*referenceHeight]
			});
	    body.angle = 0;
		
	    entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprites_info));
		entity.components.add(new HealthBarComponent(player));
		//entity.components.add(new FollowComponent(referenceSprite));
	}
};

module.exports = EntityFactory;