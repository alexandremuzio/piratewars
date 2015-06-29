'use strict'

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
var HealthComponent = require('../components/health');
var StrongholdComponent = require('../components/stronghold');

var stronghold_settings = require('../../shared/settings/stronghold.json');
var player_settings = require('../../shared/settings/player.json');

//collision groups
var PLAYER = Math.pow(2,0);
var BULLET = Math.pow(2,1);
var STRONGHOLD = Math.pow(2,2);

var PlayerFactory = {
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
	    var text = this.game.add.text(0, 0, "Edgard Yano", {
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

	    // body.damping = player_settings.physics.linear_damping;
    	// body.angularDamping = player_settings.physics.angular_damping
	    body.angle = 0;

		entity.components.add(new HealthComponent(player_settings.maxHealth));
		entity.components.add(new CooldownComponent());
		entity.components.add(new CreatorComponent());
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new SyncComponent());
		entity.components.add(new PhaserInputComponent(this.game.input));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new PlayerControllerComponent());
		entity.components.add(new TextComponent(text));

		// Subentitys
		// Creating HealthBar subentity
		var healthBar = this.createHealthBar(data.id+'-health_bar');
		healthBar.setBaseEntity(entity, 0, -30, 0);
		healthBar.setFollowBaseEntityAngle(false);

		var cannonsManager = this.createCannonsManager(data.id+'-cannons_manager');
		cannonsManager.setBaseEntity(entity, 0, 0, 0);

		return entity;
	},

	createHealthBar: function(id) {
		var entity = new Entity(id, 'health_bar');

		var scale = 1;

		var healthBarInside = this.createHealthBarInside(id+'-inside', scale);
		healthBarInside.setBaseEntity(entity, 0, 0, 0 );
		var healthBarInsideSprite = healthBarInside.components.get('sprite');

		var healthBarOutside = this.createHealthBarOutside(id+'-outside', scale);
		healthBarOutside.setBaseEntity(entity, 0, 0, 0);

		return entity;
	},

	createHealthBarInside: function(id, scale) {
		var entity = new Entity(id, 'health_bar_inside');

		var redBarSprite = this.game.add.sprite(205, 100, 'redbar');
		redBarSprite.scale.setTo(player_settings.health_bar.scale,
								 player_settings.health_bar.scale);
		redBarSprite.anchor.setTo( 0.5, 0.5);
	    
		entity.components.add(new SpriteComponent(redBarSprite));
		entity.components.add(new HealthBarComponent());
	   
		return entity;
	},

	createHealthBarOutside: function(id, scale) {
		var entity = new Entity(id, 'health_bar_outside');

		var blackBoxSprite = this.game.add.sprite(205, 100, 'blackbox');
		blackBoxSprite.anchor.setTo(0.5, 0.5);
		blackBoxSprite.scale.setTo(player_settings.health_bar.scale,
								   player_settings.health_bar.scale);
		entity.components.add(new SpriteComponent(blackBoxSprite));

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

		var cannonSprite = this.game.add.sprite(205, 100, 'cannon_0');
		cannonSprite.anchor.setTo(0.5, 0.5);
		cannonSprite.scale.setTo(0.15, 0.15);

		entity.components.add(new SpriteComponent(cannonSprite));
		entity.components.add(new CannonController());

		// Creating bulletInitialTransform subentity
		var bulletStart = this.createEmptyEntity(id+'-bullet_start', 'bullet_start');
		bulletStart.setBaseEntity(entity, 15, 0, 0);

		return entity;
	},

	createEmptyEntity : function(id, key) {
		var entity = new Entity(id, key);
		return entity;
	},

	createRemotePlayer : function(data) {
		// console.log("inside entity factory createRemotePlayer");
		
		var entity = new Entity(data.id, "remote_player");

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

	    // body.damping = player_settings.physics.linear_damping;
    	// body.angularDamping = player_settings.physics.angular_damping
	    body.angle = 0;

	    entity.components.add(new HealthComponent(player_settings.maxHealth));
		entity.components.add(new CooldownComponent());
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new SyncComponent());
		entity.components.add(new PlayerControllerComponent());

		// Subentitys
		var cannonsManager = this.createCannonsManager(data.id+'-cannons_manager')
		cannonsManager.setBaseEntity(entity, 0, 0, 0);

		return entity;
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

		entity.components.add(new HealthComponent(stronghold_settings.maxHealth));
		entity.components.add(new NetworkComponent(this.socket));
		entity.components.add(new SyncComponent());
		entity.components.add(new PhysicsComponent(body));
		entity.components.add(new SpriteComponent(sprite));
		entity.components.add(new StrongholdComponent());

		return entity;
	}
};

module.exports = PlayerFactory;