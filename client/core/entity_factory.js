'use strict'

var UUID = require('node-uuid');
var GameEngine = require('../../shared/game_engine.js');
var BulletComponent = require('../components/bullet.js');
var CannonComponent = require('../../shared/components/cannon.js');
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
var FollowComponent = require('../components/follow.js');

var physics_settings = require('../../shared/settings/boats/default_boat/physics.json');
///////////////////// Send these to a data file /////////////////////////////
var playerSpriteSize = 0.2;
var textSize = 0.2;
var healthBarSpriteSize = 0.2;
var stronghold_settings = require('../../shared/settings/stronghold.json');
var player_settings = require('../../shared/settings/player.json');

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);
var STRONGHOLD = Math.pow(2,2);


var EntityFactory = {
	init : function (data) {
		this.game = data.game;
		this.socket = data.socket;
	},

	createLocalPlayer : function(data) {
		console.log("inside entity factory createLocalPlayer")
		var entity = new Entity(data.id, "player");

		var sprite = this.game.add.sprite(100, 100, 'boat_0');
		sprite.anchor.setTo(0.5, 0.5);
	    sprite.width = player_settings.width;
	    sprite.height = player_settings.height;
	    // sprite.tint = 0xff6600;
	    
	    /* Player name, must be set by the user (MUST FIX) */
	    var text = this.game.add.text(0, 0, ".", {
		        font: player_settings.text.font,
		        fill: player_settings.text.fill,
		        align: player_settings.text.allign
		    });
		text.anchor.setTo(0.5, 0.5);

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
	    body.damping = player_settings.physics.linear_damping;
    	body.angularDamping = player_settings.physics.angular_damping
	    body.angle = 0;

		entity.components.add(new CooldownComponent());
		entity.components.add(new CreatorComponent());
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new SyncComponent());
		entity.components.add(new PhaserInputComponent(this.game.input));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new PlayerControllerComponent());
		entity.components.add(new TextComponent(text));
		entity.components.add(new CannonComponent(entity));

		// var subentity = this.createTemp();
		// subentity.setFather(entity, -30, 0, 90);

		// this.createHealthBar(entity);
		return entity;
	},

	// // MPTemp
	// createTemp : function() {
	// 	console.log("inside entity factory createLocalPlayer")
	// 	var entity = new Entity(454524, 'test');

	// 	var sprite = this.game.add.sprite(100, 100, 'boat_0');
	// 	sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
	//     sprite.scale.setTo(0.3, 0.3);
	//     sprite.tint = 0xffffff;

	// 	entity.components.add(new SpriteComponent(sprite));

	// 	// this.createHealthBar(entity);
	// 	return entity;
	// },

	createRemotePlayer : function(data) {
		// console.log("inside entity factory createRemotePlayer");
		
		var entity = new Entity(data.id, "player");

		var sprite = this.game.add.sprite(100, 100, 'boat_0');
		sprite.anchor.setTo(0.5, 0.5);
	    sprite.width = player_settings.width;
	    sprite.height = player_settings.height;
	    // sprite.tint = 0xff6600; --get color from team

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
	    body.damping = player_settings.physics.linear_damping;
    	body.angularDamping = player_settings.physics.angular_damping
	    body.angle = 0;

		entity.components.add(new CooldownComponent());
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new SyncComponent());
		entity.components.add(new PlayerControllerComponent());
		entity.components.add(new CannonComponent());
		entity.components.add(new CreatorComponent());

		return entity;
	},

	createHealthBar: function(player) {
		/* GameEngine needs an ID, now is set randomly */
		var entityInside = new Entity(UUID(), "healthBarInside"); //MUST FIX IT

		var referenceBody = player.components.get("physics").body;
		var referenceSprite = player.components.get("sprite").sprite;
		var referenceHeight = player.components.get("sprite").getHeight();

		var redBarSprite = this.game.add.sprite(205, 100, 'redbar');
		redBarSprite.anchor.setTo(0.0, 0.0);
	    redBarSprite.scale.setTo(player_settings.health_bar.scale, 
	    						 player_settings.health_bar.scale);
		
	    var bodyInside = new p2.Body({
				name: "healthBarInside",
				mass: 0, /* STATIC body */
				
				//Position must be in the right distance from reference (player)
				position: [referenceBody.position[0] - redBarSprite.width/2.0,
							 referenceBody.position[1] - 0.5*referenceHeight]
			});
	    bodyInside.angle = 0;
		
	    entityInside.components.add(new PhysicsComponent(bodyInside));
		entityInside.components.add(new SpriteComponent(redBarSprite));
		entityInside.components.add(new HealthBarComponent(player));
		entityInside.components.add(new FollowComponent(referenceSprite));

	    /* GameEngine needs an ID, now is set randomly */
		var entityOutline = new Entity(UUID(), "healthBarOutline");

		var blackBoxSprite = this.game.add.sprite(205, 100, 'blackbox');
		blackBoxSprite.anchor.setTo(0.0, 0.0);
		blackBoxSprite.scale.setTo(player_settings.health_bar.scale,
									 player_settings.health_bar.scale);
	    
	    var bodyOutline = new p2.Body({
				name: "healthBarOutline",
				mass: 0, /* STATIC body */

				//Position must be in the right distance from reference (player)
				position: [referenceBody.position[0] - blackBoxSprite.width/2.0,
							 referenceBody.position[1] - 0.5*referenceHeight]
			});
		bodyOutline.angle = 0;
	    
		entityOutline.components.add(new PhysicsComponent(bodyOutline));
		entityOutline.components.add(new SpriteComponent(blackBoxSprite));
		entityOutline.components.add(new FollowComponent(referenceSprite));
	},

	createStronghold : function(index) {
		var data = stronghold_settings.bases[index];

		var entity = new Entity(data.id, 'stronghold');

		var sprite = this.game.add.sprite(data.initialPos.x, data.initialPos.x, 'stronghold');
		sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
		sprite.width = data.width;
		sprite.height = data.height;
	    sprite.tint = data.color;

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

		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new SyncComponent());
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));

		return entity;
	},
};

module.exports = EntityFactory;