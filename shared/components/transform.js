'use strict'

var _ = require('underscore');
var MathUtils = require('../utils/math');

function Transform(owner) {
	this._position = {"x": 0, "y": 0}; 
	this._velocity = {"x": 0, "y": 0}; // remove this 
	this._angle = 0;
	// localPosition and localAngle are declared when initLocalVariables is called
	// this._localPosition = {"x": 0, "y": 0}; 
	// this._localAngle = 0;
	this._owner = owner;
	this._id = owner.id; // encapsulate this on a dataPackage
};

Transform.prototype.updateAfterWorldStep = function(){
	this.syncWithBody();
};

Transform.prototype.syncWithBody = function(){
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		// console.log('entrou no sync do body');
		var body = this._owner.components.get('physics').body;
		this.setPositionWithoutUpdateBody({ "x": body.position[0], "y": body.position[1] });
		this.setVelocityWithoutUpdateBody({ "x": body.velocity[0], "y": body.velocity[1] });
		this.setAngleWithoutUpdateBody(body.angle);
	}
};

// Update transform and body position
Transform.prototype.setPosition = function( position ){
	// console.log('setPosition begin:');
	// console.log(position);
	this.setPositionWithoutUpdateBody(position);
	this.updateBodyPosition();
	// console.log('setPosition end:');
	// console.log(this._position);
};

// Update transform and body position
Transform.prototype.setDeltaPosition = function( deltaPosition ){
	var newPosition = {
		"x": this._position.x + deltaPosition.dx,
		"y": this._position.y + deltaPosition.dy 
	};
	this.setPositionWithoutUpdateBody(newPosition);
	this.updateBodyPosition();
};

Transform.prototype.updateBodyPosition = function(){
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = phsicsComponent.body;
		body.position[0] = this._position.x;
		body.position[1] = this._position.y;
	}
};

// Update transform position
Transform.prototype.setPositionWithoutUpdateBody = function( position ){
	// console.log('setPositionWithoutUpdateBody begin:');
	// console.log(position);

	if( !position || typeof position.x !== 'number' || typeof position.y !== 'number' )
		console.error('Transform.prototype.setPositionWithoutUpdateBody = function( position ) : invalid argument');
	
	var deltaPosition = {
		"dx": position.x - this._position.x,
		"dy": position.y - this._position.y
	}

	this._position.x = position.x;
	this._position.y = position.y;
	this.updateLocalPosition();

	// Update children position
	if( this._owner.subentityManager.hasSubentity() && ( deltaPosition.dx !== 0 || deltaPosition.dy !== 0 ) ){
		// console.log(' nSubentitys = ' + this._owner.subentityManager.nSubentitys());
		_.each( this._owner.subentityManager.getAll(), function( subentity ){
			// console.error(deltaPosition);
			subentity.transform.setDeltaPosition(deltaPosition);
		});
	}

	// console.log('setPositionWithoutUpdateBody end:');
	// console.log(this._position);
};

Transform.prototype.updateLocalPosition = function(){
	if( this._owner.baseEntity ){
		var basePosition = this._owner.baseEntity.transform.getPositionWithoutSyncBody();
		this._localPosition = {
			"x": this._position.x - basePosition.x,
			"y": this._position.y - basePosition.y
		}
	}
};

// Doesn't passed by reference
Transform.prototype.getPosition = function(){
	// Sync position with body
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = this._owner.components.get('physics').body;
		this.setPositionWithoutUpdateBody({ "x": body.position[0], "y": body.position[1] });
	}

	return this.getPositionWithoutSyncBody();
};

// Doesn't passed by reference
Transform.prototype.getPositionWithoutSyncBody = function(){
	var position = {
		"x": this._position.x,
		"y": this._position.y
	}
	return position;
};

// Update transform and body angle
Transform.prototype.setAngle = function(angle){
	this.setAngleWithoutUpdateBody(angle);
	this.updateBodyAngle();
};

// Update transform and body angle
Transform.prototype.setDeltaAngle = function( deltaAngle ){
	var newAngle = this._angle + deltaAngle;
	this.setAngleWithoutUpdateBody(newAngle);
	this.updateBodyAngle();
};

Transform.prototype.updateBodyAngle = function(){
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = phsicsComponent.body;
		body.angle = this._angle;
	}
};

// Update transform angle
Transform.prototype.setAngleWithoutUpdateBody = function(angle){
	if(typeof angle !== 'number')
		console.error('Transform.prototype.setAngleWithoutUpdateBody = function(angle) : invalid argument');

	// Update children angle
	var deltaAngle = angle - this._angle;

	this._angle = angle;
	this.updateLocalAngle()

	// Update children angle
	if( this._owner.subentityManager.hasSubentity() && deltaAngle !== 0 ){
		_.each( this._owner.subentityManager.getAll(), function( subentity ){
			if( subentity.getFollowBaseEntityAngle() ){
				var localPosition = subentity.transform.getLocalPosition();
				var radius = MathUtils.module(localPosition);
				var angle = MathUtils.getAngleFromVector(localPosition) + deltaAngle;
				if( radius > 0 )
					subentity.transform.setLocalPosition(MathUtils.vector(radius, angle));
				subentity.transform.setDeltaAngle(deltaAngle);
			}
			
		});
	}
};

Transform.prototype.updateLocalAngle = function(){
	if( this._owner.baseEntity ){
		var baseEntityAngle = this._owner.baseEntity.transform.getAngleWithoutSyncBody();
		this._localAngle = this._angle - baseEntityAngle;
	}
};

Transform.prototype.getAngle = function(){
	// Sync angle with body
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = this._owner.components.get('physics').body;
		this.setAngleWithoutUpdateBody(body.angle);
	}
	return this._angle;
};

Transform.prototype.getAngleWithoutSyncBody = function(){
	return this._angle;
};

// Update body velocity
Transform.prototype.setVelocity = function(velocity){ // remove this
	this.setVelocityWithoutUpdateBody(velocity);
	this.updateBodyVelocity();
};

Transform.prototype.updateBodyVelocity = function(){ // remove this
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = phsicsComponent.body;
		body.velocity[0] = this._velocity.x;
		body.velocity[1] = this._velocity.y;
	}
};

Transform.prototype.setVelocityWithoutUpdateBody = function(velocity){ // remove this
	if( !velocity || typeof velocity.x !== 'number' || typeof velocity.y !== 'number' )
		console.error('Transform.prototype.setVelocityWithoutUpdateBody = function( velocity ) : invalid argument');

	this._velocity.x = velocity.x;
	this._velocity.y = velocity.y;
};

// Doesn't passed by reference
Transform.prototype.getVelocity = function(){ // remove this
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = this._owner.components.get('physics').body;
		this.setVelocityWithoutUpdateBody({ "x": body.velocity[0], "y": body.velocity[1] });
	}

	return this.getVelocityWithoutSyncBody();
};

// Doesn't passed by reference
Transform.prototype.getVelocityWithoutSyncBody = function(){ // remove this
	var velocity = {
		"x": this._velocity.x,
		"y": this._velocity.y
	}
	return velocity;
};

// Doesn't passed by reference
Transform.prototype.getTransform = function(){ // remove this
	var transform = {};
	transform.position = this.getPosition();
	transform.velocity = this.getVelocity();
	transform.angle = this.getAngle();
	transform.id = this._id;
	return transform;
};

// Doesn't passed by reference
Transform.prototype.getTransformWithoutSyncBody = function(){ // remove this
	var transform = {};
	transform.position = this.getPositionWithoutSyncBody();
	transform.velocity = this.getVelocityWithoutSyncBody();
	transform.angle = this.getAngleWithoutSyncBody();
	return transform;
};


Transform.prototype.setTransform = function(transform){ // remove this
	// MPTest
	// console.log('setTransform begin:');
	// console.log(transform);

	var correctTransform = true;

	if( transform.position && typeof transform.position.x === 'number' && typeof transform.position.y === 'number' )
		this.setPosition(transform.position);
	else
		correctTransform = false;
	
	if( transform.velocity && typeof transform.velocity.x === 'number' && typeof transform.velocity.y === 'number' )
		this.setVelocity(transform.velocity);
	else
		correctTransform = false;

	if( typeof transform.angle === 'number' )
		this.setAngle(transform.angle);
	else
		correctTransform = false;

	if(!correctTransform){
		console.error('setTransform invalid parameter')
		console.error(transform);
	}

	// MPTest
	// console.log('setTransform end:');
	// console.log(this.getTransformWithoutSyncBody());
};

Transform.prototype.setLocalPosition = function(localPosition){
	this._localPosition = localPosition;
	var basePosition = this._owner.baseEntity.transform.getPosition();
	var newPosition = {
		"x": basePosition.x + localPosition.x,
		"y": basePosition.y + localPosition.y
	};
	this.setPosition(newPosition);
}

Transform.prototype.getLocalPosition = function(){
	var phsicsComponent = this._owner.components.get('physics');
	if( phsicsComponent ){
		var body = this._owner.components.get('physics').body;
		this.setPositionWithoutUpdateBody({ "x": body.position[0], "y": body.position[1] });
	}
	var localPosition = {
		"x": this._localPosition.x,
		"y": this._localPosition.y
	}
	return localPosition;
}

Transform.prototype.setLocalAngle = function(localAngle){
	this._localAngle = localAngle;
	this.setAngle(this._owner.baseEntity.transform.getAngle() + localAngle);
}

Transform.prototype.initLocalVariables = function(x0, y0, alpha0){

	var x_0 =  typeof x0 === 'number' ? x0 : 0;
	var y_0 =  typeof y0 === 'number' ? y0 : 0;
	var alpha_0 = typeof alpha0 === 'number' ? alpha0 : 0;

	this.syncWithBody();

	this.setLocalPosition({ "x": x_0, "y": y_0 });
	this.setLocalAngle(alpha_0);
}

module.exports = Transform;