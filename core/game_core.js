'use strict';

var p2 = require('p2');

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
    this.body.damping = 0.95; // Velocity lost per time. Should be between 0 and 1

    var me = this;
    this.update = function(keysPressed) {
        if (keysPressed.Key_LEFT) {
            me.body.velocity[0] -= 10;
        }
        if (keysPressed.Key_RIGHT) {
            me.body.velocity[0] += 10;
        }
        if (keysPressed.Key_UP) {
            me.body.velocity[1] -= 10;
        }
        if (keysPressed.Key_DOWN) {
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

    this._dt = new Date().getTime();    //The local timer delta
    this._dte = new Date().getTime();   //The local timer last frame time
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

gameCore.prototype.createTimer = function(){
    setInterval(function(){
        this._dt = new Date().getTime() - this._dte;
        this._dte = new Date().getTime();
        this.local_time += this._dt/1000.0;
    }.bind(this), 4);
}

module.exports = gameCore;