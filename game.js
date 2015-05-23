var game = new Phaser.Game(800, 600, Phaser.AUTO, "game", { preload: preload, create: create, update: update });

var player;
var id;
var opponents = {};
var connecting = false;
var connected = false;
var socket;

function preload() {
	client_connect_to_server();

    game.load.image('ball', 'assets/ball.png');
    game.load.image('sky', 'assets/sky.png');
    // game.load.image('ground', 'assets/platform.png');
    // game.load.image('star', 'assets/star.png');
    // game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}
function create() {
	 //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    // //  The platforms group contains the ground and the 2 ledges we can jump on
    // platforms = game.add.group();

    // //  We will enable physics for any object that is created in this group
    // platforms.enableBody = true;

    // // Here we create the ground.
    // var ground = platforms.create(0, game.world.height - 64, 'ground');

    // //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    // ground.scale.setTo(2, 2);

    // //  This stops it from falling away when you jump on it
    // ground.body.immovable = true;

    // //  Now let's create two ledges
    // var ledge = platforms.create(400, 400, 'ground');

    // ledge.body.immovable = true;

    // ledge = platforms.create(-150, 250, 'ground');

    // ledge.body.immovable = true;

       // The player and its settings
    player = game.add.sprite(game.world.width/2.0, game.world.height/2.0, 'ball');
    player.scale.setTo(0.5, 0.5);
    // //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    // //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    // player.body.gravity.y = 300;
    // player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    // player.animations.add('left', [0, 1, 2, 3], 10, true);
    // player.animations.add('right', [5, 6, 7, 8], 10, true);

    // stars = game.add.group();

    // stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    // for (var i = 0; i < 12; i++)
    // {
    //     //  Create a star inside of the 'stars' group
    //     var star = stars.create(i * 70, 0, 'star');

    //     //  Let gravity do its thing
    //     star.body.gravity.y = 6;

    //     //  This just gives each star a slightly random bounce value
    //     star.body.bounce.y = 0.7 + Math.random() * 0.2;
    // }

}

function update() {
	//console.log(player.body.position.x);
	    //  Collide the player and the stars with the platforms
	//cursors = game.input.keyboard.createCursorKeys();
    // game.physics.arcade.collide(player, platforms);
    // game.physics.arcade.collide(stars, platforms);

    // game.physics.arcade.overlap(player, stars, collectStar, null, this);

        //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        //  Move to the left
        player.body.velocity.x = -150;

        // player.animations.play('left');
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        //  Move to the right
        player.body.velocity.x = 150;

        // player.animations.play('right');
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        //  Move to the right
        player.body.velocity.y = -150;

        // player.animations.play('right');
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        //  Move to the right
        player.body.velocity.y = 150;

        // player.animations.play('right');
    }
    // else
    // {
    //     //  Stand still
    //     player.animations.stop();

    //     player.frame = 4;
    // }

    // //  Allow the player to jump if they are touching the ground.
    // if (game.input.keyboard.isDown(Phaser.Keyboard.UP)&& player.body.touching.down)
    // {
    //     player.body.velocity.y = -350;
    // }
    //client_update();
}


// function collectStar (player, star) {

//     Removes the star from the screen
//     star.kill();

// }

function client_connect_to_server() {
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
        	update_players(data);

        });

        //Handle when we connect to the server, showing state and storing id's.
        this.socket.on('onconnected', function(data) {
        	connected = true;
        	id = data.id;
        	console.log("Connected!" + data.id);
        });
            //On message from the server, we parse the commands and send it to the handlers
        // this.socket.on('message', this.client_onnetmessage.bind(this));

}; //game_core.client_connect_to_server

function update_players(opponents_data) {
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
		}
	}

	for (var key in opponents) {
		if (!(key in opponents_data)) {
			opponents.id.destroy();
			delete opponents.id;
		}
	}

}

function client_update() {
	if (connected) {
		this.socket.emit('message', {position : {x : player.position.x, y : player.position.y}});
	}
};


setInterval(client_update, 1);