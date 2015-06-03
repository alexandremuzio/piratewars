'use strict';

var p2 = require('p2');
var Player = require('./player.js');
var Bullet = require('./bullet.js');

// This class that creates a world where you can simulate the physics on
// all game objects. This code should run both on the client and on the server
function GameCore() {
    this.world = new p2.World({gravity:[0, 0]});
    this.players = {};
    this.bullets = {};
    this.step = 1/60;

    this.local_time = 0.016;
    this._dt = new Date().getTime();    //The local timer delta
    this._dte = new Date().getTime();   //The local timer last frame time

    this.createTimer();
    this.bulletCounter = 0;
};

// p2 engine physics step
GameCore.prototype.physicsStep = function() {
    this.world.step(this.step);
}

// Add a generic player to the list (this class doesn't know who is the
// actual player who instantiated it)
GameCore.prototype.addPlayer = function(uuid) {
    this.players[uuid] = new Player(this, uuid, 25);

    // p2 engine function to enable physics simulation on this body
    this.world.addBody(this.players[uuid].body);
};

GameCore.prototype.addBullet = function(uuid) {
    // console.log(this.players[uuid].body.position[0], this.players[uuid].body.position[1]);
    var newBullet = new Bullet(this.players[uuid].body.position[0], this.players[uuid].body.position[1]);
    // console.log(newBullet);
    this.bullets[this.bulletCounter++] = {bullet: newBullet, angle : this.players[uuid].body.angle - 90};
    this.world.addBody(newBullet.body);

    return newBullet;
}

// When the player has a phaser object, copy the body (p2 engine) positions
// to the phaser object (doing so already updates the sprite position on the screen)
GameCore.prototype.updatePhaser = function() {
    // console.log(this.bullets);
    for (var key in this.players) {
        if (this.players[key].phaser !== null) {
            this.players[key].phaser.position.x = this.players[key].body.position[0];
            this.players[key].phaser.position.y = this.players[key].body.position[1];
            // console.log(this.players[key].phaser.angle);
        }
    }

    for (var key in this.bullets) {
        var angle = this.bullets[key].angle * Math.PI / 180.0;
        // console.log(angle, this.bullets[key].angle);

        if (this.bullets[key].bullet.phaser !== null) {
            this.bullets[key].bullet.phaser.position.x += 5 * Math.cos(angle);
            this.bullets[key].bullet.phaser.position.y += 5* Math.sin(angle);
        }
    }
}

//helper timer
GameCore.prototype.createTimer = function(){
    setInterval(function(){
        this._dt = new Date().getTime() - this._dte;
        this._dte = new Date().getTime();
        this.local_time += this._dt/1000.0;
    }.bind(this), 4);
}

module.exports = GameCore;