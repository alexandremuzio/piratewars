'use strict';

//game
var gameCoreConstructor = require('../core/game_core.js');
var gameCore;
var game;
var player;
var fpsText;
var text;

//network
var connecting = false;
var connected = false;
var socket;
var id;
var pastInputs = [];
var serverUpdates = [];
var inputSeq = 0;


var gameClient = function() {
    game = new Phaser.Game(800, 450, Phaser.AUTO, "", 
        { preload: this.preload.bind(this),
          create:  this.create.bind(this),
          update:  this.update.bind(this),
          render:  this.render.bind(this) 
        });


    this.numberOfConnectedPlayers = 0;
}

//Phaser Methods
gameClient.prototype.preload = function() {
    this.clientConnectToServer();

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = false;
    game.scale.setMinMax(1024/2, 672/2, 1024*2, 672*2);

    // Enable phaser to run its steps even on an unfocused window
    game.stage.disableVisibilityChange = true;

    game.load.tilemap('backgroundmap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('gameTiles', 'assets/watertile.png');

    game.load.image('boat_0', 'assets/boat_0.png');

    //game.load.image('sky', 'assets/sky.png');

    // FPS of game
    game.time.advancedTiming = true;

    this.numberOfConnectedPlayers++;
}

gameClient.prototype.create = function() {
    gameCore = new gameCoreConstructor();

    //start physics loop
    this.createPhysicsSimulation();

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
        font: "20px Arial",
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
}

//update loop - runs at 60fps
gameClient.prototype.update = function() {
    // Only update if is connected
    if (!connected) return;
    
    fpsText.setText("FPS: " + game.time.fps);

    var inputInfo = this.handleInput(game.input);

    //send server last input
    socket.emit('message', inputInfo);

    //client prediction
    //this.processNetUpdates();

    // console.log(keysPressed);
    //TODO: Do not update directly
    // player.update(keysPressed);


    // Copies body positions to Phaser sprites
    // gameCore.updatePhaser();

    // this.updatePhaser();
}

gameClient.prototype.render = function() {
    game.debug.cameraInfo(game.camera, 32, 32);
}

gameClient.prototype.updatePhaser = function() {
    // console.log(player.body.position);

    // game.camera.x = player.phaser.position.x + 400;
    // game.camera.y = player.phaser.position.y + 300;
}

gameClient.prototype.handleInput = function(input) {
    var inputInfo = {
        Key_LEFT    : false,
        Key_RIGHT   : false,
        Key_UP      : false,
        Key_DOWN    : false,
        Mouse_DOWN  : false,
        Mouse_X     : 0,
        Mouse_Y     : 0
    };
    if (input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
        input.keyboard.isDown(Phaser.Keyboard.A)) {
        inputInfo.Key_LEFT = true;
    }
    if (input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
        input.keyboard.isDown(Phaser.Keyboard.D)) {
        inputInfo.Key_RIGHT = true;
    }
    if (input.keyboard.isDown(Phaser.Keyboard.UP) ||
        input.keyboard.isDown(Phaser.Keyboard.W)) {
        inputInfo.Key_UP = true;
    }
    if (input.keyboard.isDown(Phaser.Keyboard.DOWN) || 
        input.keyboard.isDown(Phaser.Keyboard.S)) {
        inputInfo.Key_DOWN = true;
    }
    if( input.mousePointer.isDown ){
        inputInfo.Mouse_DOWN = true;
        inputInfo.Mouse_X = input.mousePointer.x;
        inputInfo.Mouse_Y = input.mousePointer.y;
    }

    inputSeq = inputSeq + 1;

    //game snapshot
    pastInputs.push({
        seq : inputSeq,
        time : gameCore.local_time,
        keys : inputInfo
    });

    return pastInputs[pastInputs.length - 1];
}

gameClient.prototype.clientConnectToServer = function(){
    socket = io.connect();

    var thisGameClient = this;

    socket.on('connect', function(){
        console.log("Connecting!");
        connecting = true;
    });

    socket.on('onserverupdate', this.onServerUpdateReceived.bind(this));

    socket.on('onconnected', function(data) {        
        connecting = false;
        connected = true;
        id = data.id;

        // We're adding the player here because it needs an id before adding it to the client's game core
        // This could be improved
        gameCore.addPlayer(id);
        gameCore.players[id].phaser = game.add.sprite(game.world.width/2.0, game.world.height/2.0, 'boat_0');
        player = gameCore.players[id]; // Reference to our this client's player object on this game core
        player.phaser.anchor.setTo(0.5, 0.5);
        player.phaser.scale.setTo(0.5, 0.5);
        player.phaser.tint = 0xff6600;

        //camera follows player
        game.camera.follow(player.phaser);

        console.log("Connected!" + data.id);
    });
};

gameClient.prototype.ProcessNetUpdates = function() {
}

gameClient.prototype.onServerUpdateReceived = function(data) {
    //naive aproach - temporary
    this.updatePlayers(data);

    //Store input -todo
}


gameClient.prototype.updatePlayers = function(players_data) {
    for (var key in players_data) {
        //if (key == id) continue;

        if (key in gameCore.players) { // If player is already registered on this game core
            gameCore.players[key].phaser.position.x = players_data[key].x;
            gameCore.players[key].phaser.position.y = players_data[key].y;
            gameCore.players[key].phaser.angle = players_data[key].angle;
        }

        else { // If we still don't know this player, add it to this game core
            gameCore.addPlayer(key);
            gameCore.players[key].phaser = game.add.sprite(players_data[key].x, players_data[key].y, 'boat_0');
            gameCore.players[key].phaser.scale.setTo(0.5, 0.5);
            player.phaser.anchor.setTo(0.5, 0.5);
            gameCore.players[key].phaser.tint = 0xffa0bf; //change opponent color
            this.numberOfConnectedPlayers++;
        }
    }

    for (var key in gameCore.players) {     
        if (key !== id && !(key in players_data)) { // find a way to remove key !== id
            console.log("deleted key: " + key);
            gameCore.players[key].phaser.destroy();
            delete gameCore.players[key];
            this.numberOfConnectedPlayers--;
        }
    }

    text.setText(this.numberOfConnectedPlayers + " Players Connected")
}

gameClient.prototype.updatePhysics = function() {
    // Runs p2 physics engine step
    gameCore.physicsStep();
};

//start Physics loop that runs at 60fps
gameClient.prototype.createPhysicsSimulation = function() {
    setInterval(function(){
        // this._pdt = (new Date().getTime() - this._pdte)/1000.0;
        // this._pdte = new Date().getTime();
        // this.updatePhysics();
    }.bind(this), 1000/60);
}

// Start game
var game_instance = new gameClient();

// setInterval(game_instance.clientUpdate.bind(game_instance), 30);