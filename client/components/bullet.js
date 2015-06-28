'use strict'

var BaseComponent = require('../../shared/components/bullet');
var GameEngine = require('../../shared/game_engine');

function BulletComponent() {
	BaseComponent.apply(this);
}

///
BulletComponent.prototype = Object.create(BaseComponent.prototype);
BulletComponent.prototype.constructor = BulletComponent;
///

BulletComponent.prototype.init = function() {
	this.currentTime = new Date();
	// this.createCollisionHandler();
}

BulletComponent.prototype.update = function() {
	var newCurrentTime = new Date();
	this.currentAliveTime += (newCurrentTime - this.currentTime);
	this.currentTime =  newCurrentTime;


	if (this.currentAliveTime >= this.bulletSurvivalTime) {
		//delete bullet some way
		// console.log("Bullet should be deleted now!");
		this.owner.destroy();
	}
};

// BulletComponent.prototype.createCollisionHandler = function() {
// 	var body = this.owner.components.get("physics").body;
// 	var world = GameEngine.getInstance().world;

// 	world.on("beginContact", function(event){
//         var bodyA = event.bodyA;
//         var bodyB = event.bodyB;

//         console.log("Colliding %s with %s", bodyA.entity.key, bodyB.entity.key);

//         // console.log("Impacting!!");
//         if((bodyA.id == body.id || bodyB.id == body.id)){
//         	var playerEntity = (bodyA.id != body.id ) ? bodyA.entity : bodyB.entity;
//         	// playerEntity.damage(bulletDamage, this.owner);
//         	console.log("Bullet collided");
//         }
//     });
// };
module.exports = BulletComponent;