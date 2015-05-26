'use strict';

// Key = {
//     UP : 0,
//     RIGHT : 1,
//     DOWN : 2,
//     LEFT : 3
// }

// Player class including a phaser object (not used on the server) and
// a body object (used by p2 physics engine)
function Player (uuid) {
    this.phaser = null;
    this.radius = 25; // Change the circle radius to detect collision
    this.body = new p2.Body({
        mass: 1,
        position: [100, 100]
    });
    this.body.addShape(new p2.Circle(this.radius));

    var me = this;
    this.update = function(keysPressed) {
        if (keysPressed.Key_LEFT) {
            //  Move to the left
            me.body.velocity[0] -= 10;
        }

        if (keysPressed.Key_RIGHT) {
            //  Move to the right
            me.body.velocity[0] += 10;
        }

        if (keysPressed.Key_UP) {
            //  Move up
            me.body.velocity[1] -= 10;
        }

        if (keysPressed.Key_DOWN) {
            //  Move down
            me.body.velocity[1] += 10;
        }
    }
}

// This class that creates a world where you can simulate the physics on
// all game objects. This code should run both on the client and on the server
function gameCore() {
	this.world = new p2.World({gravity:[0, 0]});
	this.players = {};
	this.step = 1/60;
}

// p2 engine physics step
gameCore.prototype.physicsStep = function() {
	this.world.step(this.step);
}

// Add a generic player to the list (this class doesn't know who is the
// actual player who instantiated it)
gameCore.prototype.addPlayer = function(uuid) {
	this.players[uuid] = new Player();

    // p2 engine function to enable physics simulation on this body
	this.world.addBody(this.players[uuid].body);
};

// When the player has a phaser object, copy the body (p2 engine) positions
// to the phaser object (doing so already updates the sprite position on the screen)
gameCore.prototype.updatePhaser = function() {
    for (var key in this.players) {
        if (this.players[key].phaser !== null) {
            this.players[key].phaser.position.x = this.players[key].body.position[0];
            this.players[key].phaser.position.y = this.players[key].body.position[1];
        }
    }
}