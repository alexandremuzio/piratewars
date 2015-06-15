'use strict'

var BaseComponent = require('../../shared/components/bullet');
var GameEngine = require('../../shared/game_engine');

///////////////////// Send these to a data file /////////////////////////////
var bulletDamage = 30;

function BulletComponent() {
	BaseComponent.apply(this);
}

///
BulletComponent.prototype = Object.create(BaseComponent.prototype);
BulletComponent.prototype.constructor = BulletComponent;
///

BulletComponent.prototype.init = function() {
	this.currentTime = new Date();
	this.createCollisionHandler();
}

BulletComponent.prototype.update = function() {
	var newCurrentTime = new Date();
	this.currentAliveTime += (newCurrentTime - this.currentTime);
	this.currentTime = newCurrentTime;

	if (this.currentAliveTime >= this.bulletSurvivalTime) {
		//delete bullet some way
		// console.log("Bullet should be deleted now!");
		this.owner.destroy();
	}
	// console.log(this.owner.components.get("physics").body.position);
};

BulletComponent.prototype.createCollisionHandler = function() {
	var body = this.owner.components.get("physics").body;
	var world = GameEngine.getInstance().world;

	world.on("impact", function(event){
        var bodyA = event.bodyA;
        var bodyB = event.bodyB;
        // console.log("Impacting!!");
        if((bodyA.id == body.id || bodyB.id == body.id)){
        	var playerEntity = (bodyA.id != body.id ) ? bodyA.entity : bodyB.entity;
        	playerEntity.damage(bulletDamage, this.owner);
        	console.log("Bullet collided");
        }
    });
};

module.exports = BulletComponent;