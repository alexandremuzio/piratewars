'use strict'

var GameEngine = require('./core/game_engine.js');
var Entity = require('./core/entity.js');
var GameComponent = require('./core/game_component.js');
var ClientSelfPlayer = require('./core/client_self_player.js');
var game;
var fpsText;
var text;
var selfPlayer;

function GameClient() {
    game = new Phaser.Game(800, 450, Phaser.AUTO, "", 
        { preload: this.preload.bind(this),
          create:  this.create.bind(this),
          update:  this.update.bind(this),
          render:  this.render.bind(this) 
        });
}

//Phaser Methods
GameClient.prototype.preload = function() {
    // this.clientConnectToServer();

    // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // game.scale.pageAlignHorizontally = true;
    // game.scale.pageAlignVertically = false;
    // game.scale.setMinMax(1024/2, 672/2, 1024*2, 672*2);

    // Enable phaser to run its steps even on an unfocused window
    game.stage.disableVisibilityChange = true;

    game.load.tilemap('backgroundmap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('gameTiles', 'assets/watertile.png');

    game.load.image('boat_0', 'assets/boat_0.png');
    game.load.image('bullet', 'assets/bullet.png');

    //game.load.image('sky', 'assets/sky.png');

    // FPS of game
    game.time.advancedTiming = true;

    // this.numberOfConnectedPlayers++;
};

GameClient.prototype.create = function() {	
	GameEngine.getInstance();

    //start physics loop
    // this.createPhysicsSimulation();

    game.world.setBounds(0, 0, 2000, 2000);

    //game.add.sprite(0, 0, 'sky');
    game.map = game.add.tilemap('backgroundmap');

    game.map.addTilesetImage('watertile', 'gameTiles');

    //create layer
    game.backgroundlayer = game.map.createLayer('backgroundLayer');
    game.blockedLayer = game.map.createLayer('islandLayer');

    //game.map.setCollisionBetween(1, 100000, true, 'islandsLayer');

    // Creating debug text
    text = game.add.text(0, 0, "0 Players Connected", {
        font: "20px Ariael",
        fill: "#ff0044",
        align: "center"
    });

    text.fixedToCamera = true;
    text.cameraOffset.setTo(310,100);

    fpsText = game.add.text(0, 0, "FPS: 0", {
        font: "12px Arial",
        fill: "#000000",
        align: "center"
    });
    fpsText.fixedToCamera = true;
    fpsText.cameraOffset.setTo(750,10);

        selfPlayer = new ClientSelfPlayer(game);
};

//update loop - runs at 60fps
GameClient.prototype.update = function() {

	GameEngine.getInstance().gameStep();

    // Only update if is connected
    // if (!connected) return;
    
    fpsText.setText("FPS: " + game.time.fps);

    // var inputInfo = this.handleInput(game.input);

    //send server last input
    // socket.emit('message', inputInfo);

    //client prediction
    //this.processNetUpdates();

    // console.log(keysPressed);
    //TODO: Do not update directly
    // player.update(keysPressed);


    // Copies body positions to Phaser sprites
    // gameCore.updatePhaser();

    // this.updatePhaser();
};

GameClient.prototype.render = function() {
    //debugging purposes
    game.debug.cameraInfo(game.camera, 32, 32);
};

var game_instance = new GameClient();