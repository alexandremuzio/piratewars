'use strict'

var PhysicsComponent = require('./physics.js');
var p2 = require('p2');

function PlayerPhysicsComponent() {
	console.log("inside PlayerPhysicsComp constr");
};

///
PlayerPhysicsComponent.prototype = Object.create(PhysicsComponent.prototype);
PlayerPhysicsComponent.prototype.constructor = PlayerPhysicsComponent;
///

PlayerPhysicsComponent.prototype.init = function() {
    var body = new p2.Body({
            name: "player",
            mass: 1,
            position: [100, 100]
        });
        body.addShape(new p2.Circle(this.radius));
        body.damping = 0.95;
        body.angularDamping = 0.95;
        body.angle = 0;
        PhysicsComponent.call(this, body);
}

PlayerPhysicsComponent.prototype.baseUpdate = PhysicsComponent.prototype.update;

PlayerPhysicsComponent.prototype.update = function() {
    this.baseUpdate();
}

// GameComponent.prototype.update = function() {
// 	console.log("inside update");
// };


module.exports = PlayerPhysicsComponent;