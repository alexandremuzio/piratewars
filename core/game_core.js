'use strict';

var p2 = require('p2');
var player_properties = require('./player_properties.json');

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
    this.body.damping = player_properties.linear_damping;
    this.body.angularDamping = player_properties.angular_damping;
    this.body.angle = 0;
    // Auxiliar variables to move player on 'click_and_go' mode
    this.x_to_go;
    this.y_to_go;
    this.angle_to_go;
    this.dir_to_go;
    this.already_reach_angle_to_go;
    this.going_to_new_point;
    this.clock_wise;

    var me = this;

    this.update = function(playerInput) {
    	this.updateMove(playerInput);
    }

    // Update the body.position and body.angle of player based on your input ( playerInput )
    this.updateMove = function(playerInput){
        if( player_properties.move_mode === "by_arrows" ){
            if (playerInput.Key_LEFT) {
                me.body.angularForce = -player_properties.angular_force;
            }
            if (playerInput.Key_RIGHT) {
                me.body.angularForce = player_properties.angular_force;
            }
            if (playerInput.Key_UP) {
                me.body.force[0] = player_properties.linear_force*Math.cos(me.body.angle*Math.PI/180);
                me.body.force[1] = player_properties.linear_force*Math.sin(me.body.angle*Math.PI/180);
            }
        }
        else if( player_properties.move_mode === "click_and_go" ){
        	/*
        	// Initialize auxiliar variables to go to new point when player clicked
            if( playerInput.Mouse_DOWN ){
                // ( dx, dy ) : direction to go, |( dx, dy )| = 1
                var dx = playerInput.Mouse_X - me.body.position[0];
                var dy = playerInput.Mouse_Y - me.body.position[1];
                var mod = Math.sqrt(dx*dx + dy*dy);
                dx /= mod;
                dy /= mod;
                var angle = Math.asin(dy)*180/Math.PI;
                if( dx < 0 )
                    angle = 180 - angle;
                if( angle > 180 )
                    angle -= 360;

                me.x_to_go = playerInput.Mouse_X;
                me.y_to_go = playerInput.Mouse_Y;
                me.angle_to_go = angle;
                me.dir_to_go = [dx, dy];
                me.already_reach_angle_to_go = false;
                me.going_to_new_point = true;
                if( me.body.angle < angle )
                	me.clock_wise = false;
                else
                	me.clock_wise = true;

                console.log("me.angle_to_go = " + me.angle_to_go);
                console.log("me.body.angle = " + me.body.angle);
            }
            // Update when player is going to new point
            if( me.going_to_new_point ){
            	// Still spinning
                if(!me.already_reach_angle_to_go){
                    if( me.clock_wise ){
                    	if( me.body.angle > me.angle_to_go )
                        	me.body.angularForce = player_properties.angular_force;
                        else{
                        	me.body.angle = me.angle_to_go;
                        	me.already_reach_angle_to_go = true;
                        }
                    }
                    else{
                    	if( me.body.angle < me.angle_to_go )
                        	me.body.angularForce = -player_properties.angular_force;
                        else{
                        	me.body.angle = me.angle_to_go;
                        	me.already_reach_angle_to_go = true;
                        }
                    }
                }
                // Finish spinning and moving to the new point
                else{

                }
            }
            */         
        }
        else{
            console.log("player_properties.move_mode must be \"by_arrows\" or \"click_and_go\"");
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