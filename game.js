// var game = new Phaser.Game(800, 600, Phaser.AUTO, "game", { preload: preload, create: create, update: update });

var game;
var player;
var id;
var opponents = {};
var connecting = false;
var connected = false;
var socket;
var numberOfConnectedPlayer = 0;
var text;
var fpsText;

var gameCore = function() {
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, "game", 
        { preload: this.preload.bind(this),
         create: this.create.bind(this),
          update: this.update.bind(this) });

    game = this.game;
    numberOfConnectedPlayer = 1;
}

gameCore.prototype.preload = function() {
    clientConnectToServer();
    this.game.load.image('ball', 'assets/ball.png');
    this.game.load.image('sky', 'assets/sky.png');

    // fps of game
    game.time.advancedTiming = true;
}

gameCore.prototype.create = function() {
  //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'sky');

       // The player and its settings
    player = this.game.add.sprite(this.game.world.width/2.0, this.game.world.height/2.0, 'ball');
    player.scale.setTo(0.5, 0.5);
    player.tint = 0x00a0bf;
    // //  We need to enable physics on the player
    this.game.physics.arcade.enable(player);

    text = this.game.add.text(this.game.world.centerX - 80, game.world.centerY/8, "0 Players Connected", {
        font: "20px Arial",
        fill: "#ff0044",
        align: "center"
    });

        //debugging
    fpsText = this.game.add.text(this.game.world.width - 50, 5, "FPS: 0", {
        font: "12px Arial",
        fill: "#000000",
        align: "center"
    });
}


gameCore.prototype.update = function() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
        this.game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        //  Move to the left
        player.body.velocity.x = -150;
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
        this.game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        //  Move to the right
        player.body.velocity.x = 150;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
        this.game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        //  Move to the right
        player.body.velocity.y = -150;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || 
        this.game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        //  Move to the right
        player.body.velocity.y = 150;
    }

    //clientUpdate();
    //update FPS
    fpsText.setText("FPS: " + this.game.time.fps);
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
        	console.log("Connected!" + data.id);
        });
            //On message from the server, we parse the commands and send it to the handlers
        // this.socket.on('message', this.client_onnetmessage.bind(this));

};


function updatePlayers(opponents_data) {
	// console.log(opponents_data[key].x, opponents_data[key].y);
	//update old/new players
	for (var key in opponents_data) {
		if (key == id) continue;

		if (key in opponents) {
			opponents[key].position.x = opponents_data[key].x;
			opponents[key].position.y = opponents_data[key].y;
		}

		else {
			opponents[key] = game.add.sprite(opponents_data[key].x, opponents_data[key].y, 'ball');
			opponents[key].scale.setTo(0.5, 0.5);
            opponents[key].tint = 0xffa0bf; //change opponent color
            numberOfConnectedPlayer++;
		}
	}

	for (var key in opponents) {
		if (!(key in opponents_data)) {
			opponents[key].destroy();
			delete opponents[key];
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
