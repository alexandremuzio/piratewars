'use strict'

var GameEngine = require('../game_engine');
var GameComponent = require('../core/component');
var EntityFactory = require('../../client/core/entity_factory');

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
            case 'space':
            	//shoot projectile
                var creator = this.owner.components.get("creator");
                console.log(EntityFactory);
                creator.createBullet();
                break;
            default:
                break;
		}
	}
};

module.exports = InputComponent;