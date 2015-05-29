'use strict';

var gameCoreConstructor = require('../core/game_core.js');
var gameCore;
var game;
var id;
var world;
var player;
var connecting = false;
var connected = false;
var socket;
var text;
var fpsText;
var pastInputs = [];

var gameClient = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, "game", 
        { preload: this.preload.bind(this),
          create:  this.create.bind(this),
          update:  this.update.bind(this) });

    this.numberOfConnectedPlayers = 0;
}

//Phaser Methods
gameClient.prototype.preload = function() {
    this.clientConnectToServer();

    // Enable phaser to run its steps even on an unfocused window
    game.stage.disableVisibilityChange = true;

    game.load.image('ball', 'assets/ball.png');
    game.load.image('sky', 'assets/sky.png');

    // FPS of game
    game.time.advancedTiming = true;

    this.numberOfConnectedPlayers++;
}

gameClient.prototype.create = function() {
    gameCore = new gameCoreConstructor();

    //start physics loop
    this.createPhysicsSimulation();

    game.add.sprite(0, 0, 'sky');

    // Creating debug text
    text = game.add.text(game.world.centerX - 80, game.world.centerY/8, "0 Players Connected", {
        font: "20px Arial",
        fill: "#ff0044",
        align: "center"
    });

    fpsText = game.add.text(game.world.width - 50, 5, "FPS: 0", {
        font: "12px Arial",
        fill: "#000000",
        align: "center"
    });
}

//update loop - runs at 60fps
gameClient.prototype.update = function() {
    // Only update physics if connected
    if (!connected) return;
    
    fpsText.setText("FPS: " + game.time.fps);

    var keysPressed = this.handleInput(game.input.keyboard);

    socket.emit('message', {time: new Date().getTime(), keys: keysPressed});

    // console.log(keysPressed);
    // player.update(keysPressed);

    // Copies body positions to Phaser sprites
    // gameCore.updatePhaser();
}

gameClient.prototype.handleInput = function(keyboard) {
    var keysPressed = {
        Key_LEFT    : false,
        Key_RIGHT   : false,
        Key_UP      : false,
        Key_DOWN    : false,
    };
    if (keyboard.isDown(Phaser.Keyboard.LEFT) ||
        keyboard.isDown(Phaser.Keyboard.A)) {
        keysPressed.Key_LEFT = true;
    }
    if (keyboard.isDown(Phaser.Keyboard.RIGHT) ||
        keyboard.isDown(Phaser.Keyboard.D)) {
        keysPressed.Key_RIGHT = true;
    }
    if (keyboard.isDown(Phaser.Keyboard.UP) ||
        keyboard.isDown(Phaser.Keyboard.W)) {
        keysPressed.Key_UP = true;
    }
    if (keyboard.isDown(Phaser.Keyboard.DOWN) || 
        keyboard.isDown(Phaser.Keyboard.S)) {
        keysPressed.Key_DOWN = true;
    }

    pastInputs.push({time: new Date().getTime(), keys: keysPressed});
    return keysPressed;
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
        gameCore.players[id].phaser = game.add.sprite(game.world.width/2.0, game.world.height/2.0, 'ball');
        player = gameCore.players[id]; // Reference to our this client's player object on this game core
        player.phaser.scale.setTo(0.5, 0.5);
        player.phaser.tint = 0x00a0bf;

        console.log("Connected!" + data.id);
    });
};

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
        }

        else { // If we still don't know this player, add it to this game core
            gameCore.addPlayer(key);
            gameCore.players[key].phaser = game.add.sprite(players_data[key].x, players_data[key].y, 'ball');
            gameCore.players[key].phaser.scale.setTo(0.5, 0.5);
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

//start Physics loop that runs at 60fps
gameClient.prototype.createPhysicsSimulation = function() {
    setInterval(function(){
        // this._pdt = (new Date().getTime() - this._pdte)/1000.0;
        // this._pdte = new Date().getTime();
        // this.updatePhysics();
    }.bind(this), 1000/60);
}

gameClient.prototype.updatePhysics = function() {
    // Runs p2 physics engine step
    gameCore.physicsStep();
};

// Start game
var game_instance = new gameClient();

// setInterval(game_instance.clientUpdate.bind(game_instance), 30);