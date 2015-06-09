'use strict'

var _ = require('underscore');
var GameEngine = require('../shared/game_engine.js');
var EntityFactory = require('./core/entity_factory.js');
var GameComponent = require('../shared/core/component.js');
var SnapshotManager = require('../shared/core/snapshot_manager.js');


function Game(socket) {
    this.game = new Phaser.Game(800, 450, Phaser.AUTO, "", 
        { preload: this.preload.bind(this),
          create:  this.create.bind(this),
          update:  this.update.bind(this),
          render:  this.render.bind(this) 
        });
    this.snapshotManager = new SnapshotManager();
    this.snapshot = null;
    this.socket = socket;
    this.id = id;
    this.numberOfConnectedPlayers = 1;
    this.entityFactory = new entityFactory(this.game);
    this.selfPlayer;
}

//Phaser Methods
Game.prototype.preload = function() {
    this.setPhaserPreferences();
    this.loadAssets();
};

Game.prototype.create = function() {
    this.game.world.setBounds(0, 0, 2000, 2000);
    this.assignAssets();
    //this.game.map.setCollisionBetween(1, 100000, true, 'islandsLayer');
    this.createTexts();
    this.createInitialEntities(); 
    this.assignNetworkCallbacks();
    GameEngine.getInstance();
};

//update loop - runs at 60fps
Game.prototype.update = function() {
    this.applySyncFromServer();
    GameEngine.getInstance().gameStep();
    this.sendInputToServer();
};

Game.prototype.render = function() {
    this.updateTexts();
};

//////////////////////////////////////
// Functions in alphabetical order: //
//////////////////////////////////////
Game.prototype.applySyncFromServer = function() {

    var lastSnapshot = snapshotManager.getLast();
    if (lastSnapshot) {
        for (var key in lastSnapshot.players) {
            if (!GameEngine().getInstance().entities[key]) {
                this.entityFactory.createRemotePlayer(key);
            }
            GameEngine().getInstance().entities[key].sync(lastSnapshot.players[key]);
        }
    }

    // Try to use underscore:
    // _.each(GameEngine.getInstance().entities, function(entity) {
    //     entity.sync(data);
    // });
}

Game.prototype.assignAssets = function() {  
    this.game.map = this.game.add.tilemap('backgroundmap');
    this.game.map.addTilesetImage('watertile', 'gameTiles');
    this.game.backgroundlayer = this.game.map.createLayer('backgroundLayer');
    this.game.blockedLayer = this.game.map.createLayer('islandLayer');
}

Game.prototype.assignNetworkCallbacks = function() {    
    this.socket.on('game.sync', this.onGameSync.bind(this));
    this.socket.on('player.create', this.onPlayerCreate.bind(this));
}

Game.prototype.createInitialEntities = function() {
    // Create turrets, bases, creeps...
}

Game.prototype.createTexts = function() {
    // Creating debug text
    this.text = this.game.add.text(0, 0, "0 Players Connected", {
        font: "20px Ariael",
        fill: "#ff0044",
        align: "center"
    });
    this.text.fixedToCamera = true;
    this.text.cameraOffset.setTo(310,100);

    this.fpsText = this.game.add.text(0, 0, "FPS: 0", {
        font: "12px Arial",
        fill: "#000000",
        align: "center"
    });
    this.fpsText.fixedToCamera = true;
    this.fpsText.cameraOffset.setTo(750,10);
}

Game.prototype.loadAssets = function() {
    this.game.load.tilemap('backgroundmap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('gameTiles', 'assets/watertile.png');
    this.game.load.image('boat_0', 'assets/boat_0.png');
    this.game.load.image('bullet', 'assets/bullet.png');
}

Game.prototype.onGameSync = function(snapshot) {
    snapshotManager.add(snapshot);
}

Game.prototype.onPlayerCreate = function(data) {    
    this.selfPlayer = this.entityFactory.createLocalPlayer(data.id);
    this.game.camera.follow(this.selfPlayer.components.get("sprite").sprite);
}

Game.prototype.sendInputToServer = function() {
    ////////////////////////// Change position to input //////////////////////////
    this.socket.emit('sync.input', { selfPlayer.transform });
}

Game.prototype.setPhaserPreferences = function() {    
    // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.game.scale.pageAlignHorizontally = true;
    // this.game.scale.pageAlignVertically = false;
    // this.game.scale.setMinMax(1024/2, 672/2, 1024*2, 672*2);

    // Enable phaser to run its steps even on an unfocused window
    this.game.stage.disableVisibilityChange = true;

    // Enable FPS of game shown on the screen
    this.game.time.advancedTiming = true;
}

Game.prototype.updateTexts = function {
    // Debugging purposes
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.fpsText.setText("FPS: " + this.game.time.fps);
}



module.exports = Game;