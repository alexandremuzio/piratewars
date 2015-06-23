'use strict'

function Transform(owner) {
	this._position = {"x": 0, "y": 0}; 
	this._velocity = {"x": 0, "y": 0}; // remove this 
	this._angle = 0;
	this._owner = owner;
};

Transform.prototype.update = function(){
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = this._owner.components.get('physics').body;
		this._position = {
			"x": body.position[0], 
			"y": body.position[1]
		};
		this._velocity = { // remove this
			"x": body.velocity[0], 
			"y": body.velocity[1]
		};
		this._angle = body.angle;
	}
};

Transform.prototype.setPosition = function( position ){
	if( !position || !position.x || !position.y )
		console.error('Transform.prototype.setPosition = function( position ) : invalid argument');
	
	this._position.x = position.x;
	this._position.y = position.y;

	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = phsicsComponent.body;
		body.position[0] = position.x;
		body.position[1] = position.y;
	}
};

Transform.prototype.getPosition = function(){
	var position = {
		"x": this._position.x,
		"y": this._position.y
	}
	return position;
};

Transform.prototype.setAngle = function(angle){
	if(!angle)
		console.error('Transform.prototype.setAngle = function(angle) : invalid argument');
	
	this._angle = angle;

	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = phsicsComponent.body;
		body.angle = angle;
	}
};

Transform.prototype.getAngle = function(){
	return this._angle;
};

Transform.prototype.setVelocity = function(velocity){ // remove this
	this._velocity.x = velocity.x;
	this._velocity.y = velocity.y;

	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = phsicsComponent.body;
		body.velocity[0] = velocity.x;
		body.velocity[1] = velocity.y;
	}
};

Transform.prototype.getVelocity = function(){ // remove this
	var velocity = {
		"x": this._velocity.x,
		"y": this._velocity.y
	}
	return velocity;
};

Transform.prototype.getTransform = function(velocity){ // remove this
	this.update();

	var transform = {};
	transform.position = {
		"x": this._position.x, 
		"y": this._position.y
	};
	transform.velocity = {
		"x": this._velocity.x,
		"y": this._velocity.y
	};
	transform.angle = this._angle;

	return transform;
};

Transform.prototype.setTransform = function(transform){ // remove this
	if( transform.position && transform.position.x && transform.position.y )
		this.setPosition(transform.position);
	if( transform.velocity && transform.position.x && transform.position.y )
		this.setVelocity(transform.velocity);
	if( transform.angle )
		this.setAngle(transform.angle);
};

module.exports = Transform;