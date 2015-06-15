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
var FollowComponent = require('../../shared/components/follow.js');

///////////////////// Send these to a data file /////////////////////////////
var playerSpriteSize = 0.2;
var textSize = 0.2;
var playerDamping = 0;
var playerAngularDamping = 0;
var playerMass = 1;
var healthBarSpriteSize = 0.2;

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
		var entity = new Entity(data.id);

		var sprite = this.game.add.sprite(100, 100, 'boat_0');
		sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
	    sprite.scale.setTo(playerSpriteSize, playerSpriteSize);
	    sprite.tint = 0xff6600;
	    
	    /* Player name, must be set by the user (MUST FIX) */
	    var text = this.game.add.text(0, 0, "Edgar Yano", {
		        font: "12px Arial",
		        fill: "#ff0044",
		        align: "center"
		    });
		text.anchor.setTo(0.5, 0.5);

		var body = new p2.Body({
	            name: "player",
	            mass: playerMass,
	            position: [100, 100]
	        });
		body.entity = entity;

		var shape = new p2.Rectangle(sprite.width, sprite.height);
		shape.collisionGroup = PLAYER;
		shape.collisionMask = BULLET | PLAYER;
	    body.addShape(shape);
	    body.damping = playerDamping;
	    body.angularDamping = playerAngularDamping;
	    body.angle = 0;
		GameEngine.getInstance().world.addBody(body);

		entity.components.add(new CooldownComponent());
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new SyncComponent());
		entity.components.add(new PhaserInputComponent(this.game.input));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new PlayerControllerComponent());
		entity.components.add(new TextComponent(text));
		entity.components.add(new CannonComponent(entity));
		entity.components.add(new CreatorComponent());

		createHealthBar(entity);
		return entity;
	},

	createRemotePlayer : function(data) {
		// console.log("inside entity factory createRemotePlayer");
		
		var entity = new Entity(data.id);

		var sprite = this.game.add.sprite(100, 100, 'boat_0');
		sprite.anchor.setTo(0.5, 0.5); // Default anchor at the center
	    sprite.scale.setTo(playerSpriteSize, playerSpriteSize);
	    sprite.tint = 0xff0066;
		var body = new p2.Body({
	            name: "player",
	            mass: playerMass,
	            position: [100, 100]
	        });
		body.entity = entity;

		var shape = new p2.Rectangle(sprite.width, sprite.height);
		shape.collisionGroup = PLAYER;
		shape.collisionMask = BULLET | PLAYER;
	    body.addShape(shape);
	    body.damping = playerDamping;
	    body.angularDamping = playerAngularDamping;
	    body.angle = 0;
		GameEngine.getInstance().world.addBody(body);

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
		var entityInside = new Entity(17); //MUST FIX IT

		var bodyInside = new p2.Body({
				name: "healthBarInside",
				mass: 0, /* STATIC body */
				position: [205, 100]
			});
		bodyInside.angle = 0;

		var redBarSprite = this.game.add.sprite(205, 100, 'redbar');
		redBarSprite.scale.setTo(healthBarSpriteSize, healthBarSpriteSize);
	    
	    entityInside.components.add(new PhysicsComponent(bodyInside));
		entityInside.components.add(new SpriteComponent(redBarSprite));
		entityInside.components.add(new HealthBarComponent(player));
		
	    /* GameEngine needs an ID, now is set randomly */
		var entityOutline = new Entity(18); //MUST FIX IT

		var bodyOutline = new p2.Body({
				name: "healthBarOutline",
				mass: 0, /* STATIC body */
				position: [205, 100]
			});
		bodyOutline.angle = 0;

	    var blackBoxSprite = this.game.add.sprite(205, 100, 'blackbox');
		blackBoxSprite.scale.setTo(healthBarSpriteSize, healthBarSpriteSize);
	    
		entityOutline.components.add(new PhysicsComponent(bodyOutline));
		entityOutline.components.add(new SpriteComponent(blackBoxSprite));
		entityOutline.components.add(new FollowComponent(bodyInside));
	}
};

module.exports = EntityFactory;

	

;