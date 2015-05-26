var game;
var id;
var world;
var player;
var connecting = false;
var connected = false;
var socket;
var numberOfConnectedPlayer = 0;
var text;
var fpsText;

var gameCore = function() {
    // Main phaser instatiation
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, "game", 
        { preload: this.preload.bind(this),
          create: this.create.bind(this),
          update: this.update.bind(this) });

    game = this.game;
    numberOfConnectedPlayer = 1;
}

gameCore.prototype.preload = function() {
    // Initialize socket.io connection
    clientConnectToServer();

    // Enable phaser to run its steps even on an unfocused window
    game.stage.disableVisibilityChange = true;

    // Loads pictures
    game.load.image('ball', 'assets/ball.png');
    game.load.image('sky', 'assets/sky.png');

    // FPS of game
    game.time.advancedTiming = true;
}

gameCore.prototype.create = function() {
    // New physics world
    world = new World();

    //  A simple background for our game
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


gameCore.prototype.update = function() {
    //update FPS
    fpsText.setText("FPS: " + game.time.fps);

    // Sends the current input to the physics simulation
    world.updatePlayer(id, game.input.keyboard);

    // Copies body positions to Phaser sprites
    world.updatePhaser();

    // Runs p2 physics engine step
    world.physicsStep();
}

function clientConnectToServer() {
	this.socket = io.connect();

        //When we connect, we are not 'connected' until we have a server id
        //and are placed in a game by the server. The server sends us a message for that.
        this.socket.on('connect', function(){
        	console.log("Connecting!");
        	connecting = true;
            //this.players.self.state = 'connecting';
        });

        //Sent each tick of the server simulation. This is our authoritive update
        this.socket.on('onserverupdate', function(data) {
        	updatePlayers(data);
        });

        //Handle when we connect to the server, showing state and storing id's.
        this.socket.on('onconnected', function(data) {
        	connected = true;
        	id = data.id;

            // We're adding the player here because it needs an id before adding it to the world
            // This could be improved
            world.addPlayer(id);
            world.players[id].phaser = game.add.sprite(game.world.width/2.0, game.world.height/2.0, 'ball');
            player = world.players[id].phaser;
            player.scale.setTo(0.5, 0.5);
            player.tint = 0x00a0bf;

        	console.log("Connected!" + data.id);
        });
            //On message from the server, we parse the commands and send it to the handlers
        // this.socket.on('message', this.client_onnetmessage.bind(this));

};


function updatePlayers(opponents_data) {
	//update old/new players
	for (var key in opponents_data) {
		if (key == id) continue;

		if (key in world.players) {
			world.players[key].body.position[0] = opponents_data[key].x;
			world.players[key].body.position[1] = opponents_data[key].y;
		}

		else {
            world.addPlayer(key);
			world.players[key].phaser = game.add.sprite(opponents_data[key].x, opponents_data[key].y, 'ball');
			world.players[key].phaser.scale.setTo(0.5, 0.5);
            world.players[key].phaser.tint = 0xffa0bf; //change opponent color
            numberOfConnectedPlayer++;
		}
	}

	for (var key in world.players) {     
		if (key !== id && !(key in opponents_data)) { // find a way to remove key !== id
            console.log("key: " + key);
			world.players[key].phaser.destroy();
			delete world.players[key];
            numberOfConnectedPlayer--;
		}
	}

    text.setText(numberOfConnectedPlayer + " Players Connected")
}

function clientUpdate() {
	if (connected) {
		this.socket.emit('message', {position : {x : player.position.x, y : player.position.y}});
	}
};

setInterval(clientUpdate, 30);

//start game
var game_instance = new gameCore();