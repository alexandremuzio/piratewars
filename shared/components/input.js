'use strict'

var GameEngine = require('../game_engine');
var GameComponent = require('../core/component');

function InputComponent() {
	console.log("inside InputComp constr");
	this.key = "input";
};

///
InputComponent.prototype = Object.create(GameComponent.prototype);
InputComponent.prototype.constructor = InputComponent;
///

InputComponent.prototype.processCommand = function(command) {
	var body = this.owner.components.get("physics").body;
    // console.log(body);

	for (var i in command) {
		switch (command[i]) {
			case 'arrowUp':
                body.force[0] = 500*Math.cos(body.angle*Math.PI/180);
                body.force[1] = 500*Math.sin(body.angle*Math.PI/180);
                break;
            case 'arrowDown':
                break;
            case 'arrowLeft':
                // if (body.velocity[0] > 5 || body.velocity[1] > 5) {
                    body.angularForce = -100//player_properties.angular_force;
                // }
                break;
            case 'arrowRight':
                // if (body.velocity[0] > 5 || body.velocity[1] > 5) {
                    body.angularForce = 100//player_properties.angular_force;
                // }
                break;
            case 'q':
            	//shoot projectile
                if (this.owner.components.get("cooldown").activate()) {
                    var creator = this.owner.components.get("creator");
                    creator.createBullet("left");
                }
                break;
            case 'e':
                //shoot projectile
                if (this.owner.components.get("cooldown").activate()) {
                    var creator = this.owner.components.get("creator");
                    creator.createBullet("right");
                }
                break;
            default:
                break;
		}
	}
};

module.exports = InputComponent;