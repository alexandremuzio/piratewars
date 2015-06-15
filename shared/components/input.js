'use strict'

var GameEngine = require('../game_engine');
var GameComponent = require('../core/component');

var physics_settings = require('../settings/boats/default_boat/physics.json');

function InputComponent() {
	// console.log("inside InputComp constr");
	this.key = "input";
    this.maxVelocity = 60;
    this.velocityStep = 1;
    this.angleStep = 0.7;
    this._followingTrajectory = false;
    this._body;
    this._clickedPoint;
    this._circle;
    this._rotating = false;
    this._rotateOnCounterClockWise;
    this._theta0;
    this._alpha = 5*Math.PI/180;
    this._nAlphaCounter = 0;
    this._clickedPointInCycle = false;
    this._centerToClickedPointVector;

    if( this.client ){
        this._game = arguments[0];
        this._nextPointIndicator;
        //Test
        this._g = this._game.add.graphics(0, 0);
    }    
};

///
InputComponent.prototype = Object.create(GameComponent.prototype);
InputComponent.prototype.constructor = InputComponent;
///

InputComponent.prototype.processCommand = function(command) {
    console.log('***')
// 	var body = this.owner.components.get("physics").body;
//     // console.log(body);
//     var velocity = Math.sqrt(Math.pow(body.velocity[0], 2) + Math.pow(body.velocity[1], 2));
// 	for (var i in command) {
// 		switch (command[i]) {
// 			case 'arrowUp':
//                 velocity += this.velocityStep;
//                 break;
//             case 'arrowDown':
//                 velocity -= this.velocityStep;
//                 break;
//             case 'arrowLeft':
//                 body.angle -= this.angleStep;
//                 // if (body.velocity[0] > 5 || body.velocity[1] > 5) {
//                     // body.angularForce = -100
//                     //player_properties.angular_force;
//                 // }
//                 break;
//             case 'arrowRight':
//                 body.angle += this.angleStep;
//                 // if (body.velocity[0] > 5 || body.velocity[1] > 5) {
//                     //body.angularForce = +100
//                     //player_properties.angular_force;
//                 // }
//                 break;
//             case 'q':
//             	//shoot projectile
//                 if (this.owner.components.get("cooldown").activate()) {
//                     var cannons = this.owner.components.get("cannon");
//                     cannons.shootLeftCannons();
//                 }
//                 break;
//             case 'e':
//                 //shoot projectile
//                 if (this.owner.components.get("cooldown").activate()) {
//                     var cannons = this.owner.components.get("cannon");
//                     cannons.shootRightCannons();
//                 }
//                 break;
//             default:
//                 break;
// 		}
// 	}
//     if (velocity < 0)                { velocity = 0; }
//     if (velocity > this.maxVelocity) { velocity = this.maxVelocity; }
//     body.velocity[0] = velocity*Math.cos(body.angle*Math.PI/180);
//     body.velocity[1] = velocity*Math.sin(body.angle*Math.PI/180);
    console.log('processCommand called');

	if( this._body == null )
        this._body = this.owner.components.get("physics").body;

    if( this.hasArrowCommand(command)){
        if( this._followingTrajectory ){ // Move by arrows => destroy current trajectory
            this.clearCurrentTrajectory();
            this._followingTrajectory = false;
        }
        this.arrowCommandUpdate(command);
    }
    else if( command.mouseLeftButtonDown ){ // Mouse click
        if( this._followingTrajectory ){ // Change trajectory
            this.clearCurrentTrajectory();
        }
        this.initNewTrajectory(command);
        this._followingTrajectory = true;
    }

    if( this._followingTrajectory ){
        this.followTrajectoryUpdate();
    }
};

InputComponent.prototype.hasArrowCommand = function(command) {
    if( typeof command.arrowUp === 'boolean'     ||
        typeof command.arrowDown === 'boolean'   ||
        typeof command.arrowRight === 'boolean'  ||
        typeof command.arrowLeft === 'boolean')
        return true;
    return false;
};

InputComponent.prototype.arrowCommandUpdate = function(command) {
    var velocityVector = {
        "x": this._body.velocity[0],
        "y": this._body.velocity[1]
    };
    var velocityModule = this.module(velocityVector);
    var velAngle = this.getAngleFromVector(velocityVector);

    if( Math.abs(this.getDeltaAngleFromAngles( velAngle, this._body.angle)) > 90 ) // Reverse gear on
        velocityModule *= -1;

    var curveOn = false;
    if( velocityModule > physics_settings.min_velocity_to_curve )
        curveOn = true;
    else if( velocityModule < -physics_settings.min_velocity_to_curve && physics_settings.curve_in_reverse_gear )
        curveOn = true;

    if (command.arrowLeft && curveOn) {
        this._body.angularForce = -physics_settings.angular_force;
    }
    if (command.arrowRight && curveOn) {
        this._body.angularForce = physics_settings.angular_force;
    }
    if (command.arrowUp && velocityModule > -physics_settings.max_velocity_to_reverse) {
        this._body.force[0] = physics_settings.linear_force*Math.cos(this._body.angle*Math.PI/180);
        this._body.force[1] = physics_settings.linear_force*Math.sin(this._body.angle*Math.PI/180);
    }
    if(command.arrowDown && physics_settings.reverse_gear && velocityModule < physics_settings.max_velocity_to_reverse){
        this._body.force[0] = -physics_settings.linear_force*Math.cos(this._body.angle*Math.PI/180);
        this._body.force[1] = -physics_settings.linear_force*Math.sin(this._body.angle*Math.PI/180);
    }
};

InputComponent.prototype.initNewTrajectory = function(command){
    //Test
    // this._g.lineStyle(2, 0xff0000);
    // this._g.drawCircle(command.mouseWorldX, command.mouseWorldY, 50);

    // Normalized vector in boat direction
    var boatDirectionVector = this.getBoatDirectionVector();
    // Normalized vector in boat to clicked point direction
    var boatToClickedPointVector = this.getBoatToClickedPointVector(command);

    this._rotateOnCounterClockWise = this.v1ReachV2RotatingOnCounterClockWise(boatDirectionVector, boatToClickedPointVector);

    this._circle = this.getTrajectoryCircle(boatDirectionVector);

    //Test
    // this._g.lineStyle(2, 0x00ff00);
    // this._g.drawCircle(this._circle.x0, this._circle.y0, 2*this._circle.radius);

    var circleCenterToBoatVector = {
        "x": this._body.position[0] - this._circle.x0,
        "y": this._body.position[1] - this._circle.y0
    }
    this._theta0 = this.getAngleFromVector(circleCenterToBoatVector)*Math.PI/180; // In world coordinates
    this._nAlphaCounter = 0;
    this._clickedPoint = {
        "x": command.mouseWorldX,
        "y": command.mouseWorldY
    }
    this._rotating = true;

    this._centerToClickedPointVector = {
        "x": command.mouseWorldX - this._circle.x0,
        "y": command.mouseWorldY - this._circle.y0
    }
    if( this.module(this._centerToClickedPointVector) < this._circle.radius )
        this._clickedPointInCycle = true;
    else
        this._clickedPointInCycle = false;

    if( this.client ){
        this.createNextPointIndicator( command.mouseWorldX, command.mouseWorldY );
    }
}

// In world coordinates
InputComponent.prototype.getTrajectoryCircle = function(boatDirectionVector){
    var circle = {};
    circle.radius = physics_settings.curve_radius;
    var vAux = {};
    if( this._rotateOnCounterClockWise ){
        vAux.x = -boatDirectionVector.y;
        vAux.y = boatDirectionVector.x;
    }
    else{
        vAux.x = boatDirectionVector.y;
        vAux.y = -boatDirectionVector.x;
    }
    circle.x0 = this._body.position[0] + vAux.x*circle.radius;
    circle.y0 = this._body.position[1] - vAux.y*circle.radius;
    return circle;
};

InputComponent.prototype.followTrajectoryUpdate = function(command) { 
    if( this._rotating ){  
        var boatToClickedPointVector = { // In normal coordinates
            "x": this._clickedPoint.x - this._body.position[0],
            "y": -(this._clickedPoint.y - this._body.position[1])
        }

        // Test
        // this._g.lineStyle(2, 0x0000ff);
        // this._g.moveTo(this._body.position[0], this._body.position[1]);
        // this._g.lineTo(this._clickedPoint.x, this._clickedPoint.y);

        var boatDirectionVector = this.getVectorFromAngle(this._body.angle); // In normal coordinates

        // Test
        // this._g.lineStyle(2, 0x000000);
        // this._g.moveTo(this._body.position[0], this._body.position[1]);
        // this._g.lineTo(this._body.position[0] + boatDirectionVector.x*100, this._body.position[1] - boatDirectionVector.y*100);

        var centerToBoat = { // In world coordinates
            "x": this._body.position[0] - this._circle.x0,
            "y": this._body.position[1] - this._circle.y0
        };
        this.normalize(centerToBoat);

        if( this._clickedPointInCycle ){
            if( Math.abs(this.getDeltaAngleFromVectors(centerToBoat, this._centerToClickedPointVector)) < 5 ){
                if( this.client )
                    this._nextPointIndicator.autoDestroy();
                this._rotating = false;
            }  
        }
        else{
            if( !this._rotateOnCounterClockWise ){
                if(!this._clickedPointInCycle && this.v1ReachV2RotatingOnCounterClockWise( boatDirectionVector, boatToClickedPointVector)){
                    boatToClickedPointVector.y *= -1; // Now boatToClickedPointVector.y is in world coordinates
                    this._body.angle = this.getAngleFromVector(boatToClickedPointVector);
                    if( this.client )
                        this._nextPointIndicator.autoDestroy();
                    this._rotating = false;
                }
            }
            else{
                if(!this._clickedPointInCycle && this.v1ReachV2RotatingOnCounterClockWise(boatToClickedPointVector, boatDirectionVector)){
                    boatToClickedPointVector.y *= -1; // Now boatToClickedPointVector.y is in world coordinates
                    this._body.angle = this.getAngleFromVector(boatToClickedPointVector);
                    if(this.client)
                        this._nextPointIndicator.autoDestroy();
                    this._rotating = false;
                }
            }
        }

        if(this._rotating){
            // Setting body position
            this._body.position[0] = this._circle.x0 + centerToBoat.x*this._circle.radius;
            this._body.position[1] = this._circle.y0 + centerToBoat.y*this._circle.radius;

            if( this._rotateOnCounterClockWise )
                boatDirectionVector = this.rotate90CW(centerToBoat);
            else
                boatDirectionVector = this.rotate90CCW(centerToBoat);

            var velocityVector = {
                "x": this._body.velocity[0],
                "y": this._body.velocity[1]
            };
            var velocityModule = this.module(velocityVector);

            this._body.angle = this.getAngleFromVector(boatDirectionVector);
            this._body.velocity[0] = boatDirectionVector.x*velocityModule;
            this._body.velocity[1] = boatDirectionVector.y*velocityModule;
        }
    }

    this._body.force[0] = physics_settings.linear_force*Math.cos(this._body.angle*Math.PI/180);
    this._body.force[1] = physics_settings.linear_force*Math.sin(this._body.angle*Math.PI/180);
};

InputComponent.prototype.clearCurrentTrajectory = function(command) {
    if( this._nextPointIndicator )
        this._nextPointIndicator.autoDestroy();
};

// v and v2 in normal coordinates
InputComponent.prototype.rotate90CCW = function(v){
    var v2 = {
        "x": -v.y,
        "y": v.x
    }
    return v2;
}

// v and v2 in normal coordinates
InputComponent.prototype.rotate90CW = function(v){
    var v2 = {
        "x": v.y,
        "y": -v.x
    }
    return v2;
}

// Boat direction vector in normal coordinates ( y in correct direction )
InputComponent.prototype.getBoatDirectionVector = function(command){
    var boat_vector = {
        "x": Math.cos(this._body.angle*Math.PI/180),
        "y": -Math.sin(this._body.angle*Math.PI/180)
    };
    return boat_vector;
}

// Boat to clicked point direction vector in normal coordinates
InputComponent.prototype.getBoatToClickedPointVector = function(command){
    var boat_to_point_vector = {};
    boat_to_point_vector.x = command.mouseWorldX - this._body.position[0];
    boat_to_point_vector.y = -(command.mouseWorldY - this._body.position[1]);
    this.normalize(boat_to_point_vector);
    return boat_to_point_vector;
}

// v1 and v2 in normal coordinates
InputComponent.prototype.v1ReachV2RotatingOnCounterClockWise = function(v1, v2){
    return this.crossProduct(v1, v2) > 0;
}

// v1 and v2 in normal coordinates
InputComponent.prototype.crossProduct = function(v1, v2){
    return v1.x*v2.y-v1.y*v2.x;
}

// Return diference angle(degree) between finalAngle(degree) and currentAngle(degree)
// Return value is greater than zero: currentAngle reach finalAngle on clockWise direction
// Return value is less than zero: currentAngle reach finalAngle on counterClockWise direction
InputComponent.prototype.getDeltaAngleFromAngles = function( finalAngle, currentAngle ){
    var delta = (finalAngle - currentAngle)%360;
    if( delta > 180 )
        delta -= 360;
    if( delta < -180 )
        delta += 360;
    return delta;
};

// Input vectors in world coordinates
// Return diference angle(degree) between finalVector and currentVector
// Return value is greater than zero: currentVector reach finalVector on clockWise direction
// Return value is less than zero: currentVector reach finalVector on counterClockWise direction
InputComponent.prototype.getDeltaAngleFromVectors = function( finalVector, currentVector ){
    var finalAngle = this.getAngleFromVector(finalVector);
    var currentAngle = this.getAngleFromVector(currentVector);
    var delta = (finalAngle - currentAngle)%360;
    if( delta > 180 )
        delta -= 360;
    if( delta < -180 )
        delta += 360;
    return delta;
};

// The v vector is in world coordinates
// The returned angle is positive in the clock-wise direction because of the world coordinate system
// The returned angle is in degree
InputComponent.prototype.getAngleFromVector = function(v){
    var angle = Math.asin(this.normalize(v).y)*180/Math.PI;
    if( v.x < 0 )
        angle = 180 - angle;
    return angle;
};

// Angle in degree and in world coordinates
// The returned vector is in normal coordinates
InputComponent.prototype.getVectorFromAngle = function(angle){
    var v = {
        "x": Math.cos(angle*Math.PI/180),
        "y": -Math.sin(angle*Math.PI/180)
    }
    return v;
};

InputComponent.prototype.normalize = function(v){
    var mod = this.module(v);
    v.x /= mod;
    v.y /= mod;
    return v;
};

InputComponent.prototype.module = function(v){
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
}

module.exports = InputComponent;