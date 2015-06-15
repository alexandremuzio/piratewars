'use strict'

var GameEngine = require('../game_engine');
var GameComponent = require('../core/component');

function InputComponent() {
	// console.log("inside InputComp constr");
	this.key = "input";
    this.maxVelocity = 60;
    this.velocityStep = 1;
    this.angleStep = 0.7;
};

///
InputComponent.prototype = Object.create(GameComponent.prototype);
InputComponent.prototype.constructor = InputComponent;
///

InputComponent.prototype.processCommand = function(command) {
	var body = this.owner.components.get("physics").body;
    // console.log(body);
    var velocity = Math.sqrt(Math.pow(body.velocity[0], 2) + Math.pow(body.velocity[1], 2));
	for (var i in command) {
		switch (command[i]) {
			case 'arrowUp':
                velocity += this.velocityStep;
                break;
            case 'arrowDown':
                velocity -= this.velocityStep;
                break;
            case 'arrowLeft':
                body.angle -= this.angleStep;
                // if (body.velocity[0] > 5 || body.velocity[1] > 5) {
                    // body.angularForce = -100
                    //player_properties.angular_force;
                // }
                break;
            case 'arrowRight':
                body.angle += this.angleStep;
                // if (body.velocity[0] > 5 || body.velocity[1] > 5) {
                    //body.angularForce = +100
                    //player_properties.angular_force;
                // }
                break;
            case 'q':
            	//shoot projectile
                if (this.owner.components.get("cooldown").activate()) {
                    var cannons = this.owner.components.get("cannon");
                    cannons.shootLeftCannons();
                }
                break;
            case 'e':
                //shoot projectile
                if (this.owner.components.get("cooldown").activate()) {
                    var cannons = this.owner.components.get("cannon");
                    cannons.shootRightCannons();
                }
                break;
            default:
                break;
		}
	}
    if (velocity < 0)                { velocity = 0; }
    if (velocity > this.maxVelocity) { velocity = this.maxVelocity; }
    body.velocity[0] = velocity*Math.cos(body.angle*Math.PI/180);
    body.velocity[1] = velocity*Math.sin(body.angle*Math.PI/180);
};

module.exports = InputComponent;