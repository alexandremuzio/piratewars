'use strict'

var PhysicsComponent = require('./physics_component.js');
var p2 = require('p2');

function PlayerPhysicsComponent() {
	console.log("inside PlayerPhysicsComp constr");
	var body = new p2.Body({
        name: "player",
        mass: 1,
        position: [100, 100]
    });
    body.addShape(new p2.Circle(this.radius));
    // this.body.damping = player_properties.linear_damping;
    // this.body.angularDamping = player_properties.angular_damping;
    // this.body.angle = 0;
    // console.log("Showing body... \\/");
    // console.log(body);
	PhysicsComponent.call(this, body);
	console.log("chave: " + this.key);
};

///
PlayerPhysicsComponent.prototype = Object.create(PhysicsComponent.prototype);
PlayerPhysicsComponent.prototype.constructor = PlayerPhysicsComponent;
///


// GameComponent.prototype.update = function() {
// 	console.log("inside update");
// };


module.exports = PlayerPhysicsComponent;