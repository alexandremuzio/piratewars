'use strict';

var gameCoreConstructor = require('./game_core.js');
var gameCore;
var game;
var id;
var world;
var player;
var connecting = false;
var connected = false;
var socket;
var numberOfConnectedPlayers = 0;
var text;
var fpsText;

var gameClient = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, "game", 
        { preload: this.preload.bind(this),
          create:  this.create.bind(this),
          update:  this.update.bind(this) });
}

gameClient.prototype.preload = function() {
    this.clientConnectToServer();

    // Enable phaser to run its steps even on an unfocused window
    game.stage.disableVisibilityChange = true;

    game.load.image('ball', 'assets/ball.png');
    game.load.image('sky', 'assets/sky.png');

    // FPS of game
    game.time.advancedTiming = true;

    numberOfConnectedPlayers = 1;
}

gameClient.prototype.create = function() {
    gameCore = new gameCoreConstructor();

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

gameClient.prototype.update = function() {
    // Only update physics if connected
    if (!connected) return;
    
    fpsText.setText("FPS: " + game.time.fps);

    var keysPressed = this.handleInput(game.input.keyboard);

    socket.emit('message', {keys: keysPressed});

    // Sends the current input to the physics simulation
    //player.update(keysPressed);

    // Runs p2 physics engine step
    //world.physicsStep();

    // Copies body positions to Phaser sprites
    //world.updatePhaser();
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
    return keysPressed;
}

gameClient.prototype.clientConnectToServer = function(){
	socket = io.connect();

    var thisGameClient = this;

    socket.on('connect', function(){
    	console.log("Connecting!");
    	connecting = true;
    });

    socket.on('onserverupdate', function(data) {
    	thisGameClient.updatePlayers(data);
    });

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


gameClient.prototype.updatePlayers = function(players_data) {
	for (var key in players_data) {
		//if (key == id) continue;

		if (key in gameCore.players) { // If player is already registered on this game core
			gameCore.players[key].phaser.position.x = players_data[key].x;
			gameCore.players[key].phaser.position.y = players_data[key].y;
		}

		else { // If we still don't know this player, add it to this game core
            world.addPlayer(key);
			gameCore.players[key].phaser = game.add.sprite(players_data[key].x, players_data[key].y, 'ball');
			gameCore.players[key].phaser.scale.setTo(0.5, 0.5);
            gameCore.players[key].phaser.tint = 0xffa0bf; //change opponent color
            numberOfConnectedPlayers++;
		}
	}

	for (var key in gameCore.players) {     
		if (key !== id && !(key in players_data)) { // find a way to remove key !== id
            console.log("deleted key: " + key);
			gameCore.players[key].phaser.destroy();
			delete gameCore.players[key];
            numberOfConnectedPlayers--;
		}
	}

    text.setText(numberOfConnectedPlayers + " Players Connected")
}

// gameClient.prototype.clientUpdate = function() {
// 	if (connected) {
// 		this.socket.emit('message', {position : {x : player.phaser.position.x, y : player.phaser.position.y}});
// 	}
// };

// Start game
var game_instance = new gameClient();

// setInterval(game_instance.clientUpdate.bind(game_instance), 30);