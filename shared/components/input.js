'use strict';

// var GameEngine = require('../game_engine');
var GameComponent = require('../core/component');

var physics_settings = require('../settings/player.json').physics;

function InputComponent() {
    // console.log('inside InputComp constr');
    this.key = 'input';
    this.followingTrajectory = false;
    this._rotating = false;
    this._clickedPointInCycle = false;
    this._processCommandBoolean = true;
    this._processAttackBoolean = true;
    this.initNewTrajectoryCalled = false;
    this._actualForce = 0;
}

///
InputComponent.prototype = Object.create(GameComponent.prototype);
InputComponent.prototype.constructor = InputComponent;
///

InputComponent.prototype.init = function () {
    this.owner.on('entity.revive', this.onEntityRevive.bind(this));
    this.owner.on('entity.die', this.onEntityDie.bind(this));
};

InputComponent.prototype.onEntityDie = function () {
    console.log('dying in input shared');
    this._processCommandBoolean = false;
    this._processAttackBoolean = false;
};

InputComponent.prototype.onEntityRevive = function () {
    this._processCommandBoolean = true;
    this._processAttackBoolean = true;
    this.resetVelocity();
};

InputComponent.prototype.resetVelocity = function () {
    if (this._body == null)
        this._body = this.owner.components.get('physics').body;

    this._body.velocity[0] = 0;
    this._body.velocity[1] = 0;
};

InputComponent.prototype.processCommand = function (command) {
    if (this._processCommandBoolean === true) {
        if (this._body == null)
            this._body = this.owner.components.get('physics').body;

        this.processAttack(command);
        //    if( this.hasArrowCommand(command)){
        //        if( this.followingTrajectory ){ // Move by arrows => destroy current trajectory
        //            this.followingTrajectory = false;
        //        }
        this.processArrowCommand(command);
        //    }
        //    else if( command.mouseLeftButtonDown ){ // Mouse click
        //        this.initNewTrajectory(command);
        //    }

        //    if( this.followingTrajectory ){
        //        this.followTrajectoryUpdate();
        //    }

        //    this.correctVelocity();
    }
};

InputComponent.prototype.processAttack = function (command) {
    if (this._processAttackBoolean === true) {
        if (command.qKey) {
            if (this.owner.components.get('cooldown').activate()) {
                var cannonsManager = this.owner.subentityManager.get('cannons_manager');
                var cannonsManagerController = cannonsManager.components.get('cannons_manager_controller');
                cannonsManagerController.shootLeft();
            }
        }
        if (command.eKey) {
            if (this.owner.components.get('cooldown').activate()) {
                var cannonsManager = this.owner.subentityManager.get('cannons_manager');
                var cannonsManagerController = cannonsManager.components.get('cannons_manager_controller');
                cannonsManagerController.shootRight();
            }
        }
    }
    if (command.spaceKey) {
        // remove && this.owner.components.get('sprite')
        if (this.owner.components.get('cooldown').mineActivate()) {
            // console.log('SpaceKey clicked!!!!!!!!!!!!');
            var mineStartTransform = this.owner.subentityManager.get('mine_start').transform;
            var mineStartPosition = mineStartTransform.getPosition();
            var boatAngle = mineStartTransform.getAngle();
            var boatVelocityArray = this.owner.components.get('physics').body.velocity;
            this.owner.components.get('mine_generator').createMines(mineStartPosition, boatAngle, boatVelocityArray);
            // GameEngine.getInstance().printEntityHierarchy();
        }
    }
};

InputComponent.prototype.hasArrowCommand = function (command) {
    if (typeof command.arrowUp === 'boolean' ||
        typeof command.arrowDown === 'boolean' ||
        typeof command.arrowRight === 'boolean' ||
        typeof command.arrowLeft === 'boolean')
        return true;
    return false;
};

InputComponent.prototype.processArrowCommand = function (command) {
    // var velocity = this.getVelocity();
    // var velAngle = this.getAngleFromVector(this.getVelocityVector);

    // if( Math.abs(this.getDeltaAngleFromAngles( velAngle, this._body.angle)) > 90 ) // Reverse gear on
    //     velocity *= -1;

    // var curveOn = false;
    // if( velocity > physics_settings.min_velocity_to_curve )
    var curveOn = true; //////////////////////////////////////////////////

    if (command.arrowUp) {
        // this._body.force[0] = physics_settings.linear_force*Math.cos(this._body.angle*Math.PI/180);
        // this._body.force[1] = physics_settings.linear_force*Math.sin(this._body.angle*Math.PI/180);
        this._actualForce += physics_settings.velocity_step;
    }
    if (command.arrowDown) {
        // this._body.force[0] = -physics_settings.linear_force*Math.cos(this._body.angle*Math.PI/180);
        // this._body.force[1] = -physics_settings.linear_force*Math.sin(this._body.angle*Math.PI/180);
        this._actualForce -= physics_settings.velocity_step;
    }

    if (this._actualForce < physics_settings.min_velocity) { this._actualForce = physics_settings.min_velocity; }
    if (this._actualForce > physics_settings.max_velocity) { this._actualForce = physics_settings.max_velocity; }

    if (command.arrowLeft && curveOn) {
        // Temp
        // this._body.angle += -(physics_settings.angle_step + velocity*physics_settings.turn_ratio);
        this._body.angularForce = -physics_settings.angular_force;
    }
    if (command.arrowRight && curveOn) {
        // Temp
        // this._body.angle += (physics_settings.angle_step + velocity*physics_settings.turn_ratio);        
        this._body.angularForce = physics_settings.angular_force;
    }

    this._body.force[0] = this._actualForce * Math.cos(this._body.angle);
    this._body.force[1] = this._actualForce * Math.sin(this._body.angle);
    // console.log(this._body.getAABB().lowerBound)
};

InputComponent.prototype.initNewTrajectory = function (command) {
    this.initNewTrajectoryCalled = true; // Acessed by client/input to create new nextPointIndicator

    //Test
    // this._g.lineStyle(2, 0xff0000);
    // this._g.drawCircle(command.mouseWorldX, command.mouseWorldY, 50);

    // Normalized vector in boat direction ( normal coordinates )
    var boatDirectionVector = this.getBoatDirectionVector();
    // Normalized vector in boat to clicked point direction ( normal coordinates )
    var boatToClickedPointVector = this.getBoatToClickedPointVector(command);

    this._rotateOnCounterClockWise = this.v1ReachV2RotatingOnCounterClockWise(boatDirectionVector, boatToClickedPointVector);

    this._circle = this.getTrajectoryCircle(boatDirectionVector);

    //Test
    // this._g.lineStyle(2, 0x00ff00);
    // this._g.drawCircle(this._circle.x0, this._circle.y0, 2*this._circle.radius);

    var circleCenterToBoatVector = { // In world coordinates
        'x': this._body.position[0] - this._circle.x0,
        'y': this._body.position[1] - this._circle.y0
    };
    this._clickedPoint = {
        'x': command.mouseWorldX,
        'y': command.mouseWorldY
    };

    this._rotating = true;
    this.followingTrajectory = true;

    this._centerToClickedPointVector = {
        'x': command.mouseWorldX - this._circle.x0,
        'y': command.mouseWorldY - this._circle.y0
    };
    if (this.module(this._centerToClickedPointVector) < this._circle.radius)
        this._clickedPointInCycle = true;
    else
        this._clickedPointInCycle = false;
};

InputComponent.prototype.followTrajectoryUpdate = function (command) {
    if (this._rotating) {
        var boatToClickedPointVector = { // In normal coordinates
            'x': this._clickedPoint.x - this._body.position[0],
            'y': -(this._clickedPoint.y - this._body.position[1])
        };

        // Test
        // this._g.lineStyle(2, 0x0000ff);
        // this._g.moveTo(this._body.position[0], this._body.position[1]);
        // this._g.lineTo(this._clickedPoint.x, this._clickedPoint.y);

        var boatDirectionVector = this.getBoatDirectionVector(); // In normal coordinates

        // Test
        // this._g.lineStyle(2, 0x000000);
        // this._g.moveTo(this._body.position[0], this._body.position[1]);
        // this._g.lineTo(this._body.position[0] + boatDirectionVector.x*100, this._body.position[1] - boatDirectionVector.y*100);

        var centerToBoat = { // In world coordinates
            'x': this._body.position[0] - this._circle.x0,
            'y': this._body.position[1] - this._circle.y0
        };
        this.normalize(centerToBoat);

        if (this._clickedPointInCycle) {
            if (Math.abs(this.getDeltaAngleFromVectors(centerToBoat, this._centerToClickedPointVector)) < 5) {
                this._rotating = false;
                this._followingTrajectory = false;
            }
        }
        else {
            if (!this._rotateOnCounterClockWise) {
                if (!this._clickedPointInCycle && this.v1ReachV2RotatingOnCounterClockWise(boatDirectionVector, boatToClickedPointVector)) {
                    boatToClickedPointVector.y *= -1; // Now boatToClickedPointVector.y is in world coordinates
                    this._body.angle = this.getAngleFromVector(boatToClickedPointVector);
                    this._rotating = false;
                    this._followingTrajectory = false;
                }
            }
            else {
                if (!this._clickedPointInCycle && this.v1ReachV2RotatingOnCounterClockWise(boatToClickedPointVector, boatDirectionVector)) {
                    boatToClickedPointVector.y *= -1; // Now boatToClickedPointVector.y is in world coordinates
                    this._body.angle = this.getAngleFromVector(boatToClickedPointVector);
                    this._rotating = false;
                    this._followingTrajectory = false;
                }
            }
        }

        if (this._rotating) {
            // Setting body position
            this._body.position[0] = this._circle.x0 + centerToBoat.x * this._circle.radius;
            this._body.position[1] = this._circle.y0 + centerToBoat.y * this._circle.radius;

            if (this._rotateOnCounterClockWise)
                boatDirectionVector = this.rotate90CW(centerToBoat);
            else
                boatDirectionVector = this.rotate90CCW(centerToBoat);

            var velocityVector = {
                'x': this._body.velocity[0],
                'y': this._body.velocity[1]
            };
            var velocityModule = this.module(velocityVector);

            this._body.angle = this.getAngleFromVector(boatDirectionVector);
            this._body.velocity[0] = boatDirectionVector.x * velocityModule;
            this._body.velocity[1] = boatDirectionVector.y * velocityModule;
        }
    }

    var velocity = this.getVelocity();

    this._body.velocity[0] = velocity * Math.cos(this._body.angle);
    this._body.velocity[1] = velocity * Math.sin(this._body.angle);
};

InputComponent.prototype.correctVelocity = function () {
    var velocity = this.getVelocity();

    if (velocity < physics_settings.min_velocity) { velocity = physics_settings.min_velocity; }
    if (velocity > physics_settings.max_velocity) { velocity = physics_settings.max_velocity; }

    this._body.velocity[0] = velocity * Math.cos(this._body.angle);
    this._body.velocity[1] = velocity * Math.sin(this._body.angle);
};

InputComponent.prototype.getVelocityVector = function () {
    var velocityVector = {
        'x': this._body.velocity[0],
        'y': this._body.velocity[1]
    };
    return velocityVector;
};

InputComponent.prototype.getVelocity = function () {
    return this.module(this.getVelocityVector());
};

// In world coordinates
InputComponent.prototype.getTrajectoryCircle = function (boatDirectionVector) {
    var circle = {};
    circle.radius = physics_settings.curve_radius;
    var vAux = {};
    if (this._rotateOnCounterClockWise)
        vAux = this.rotate90CCW(boatDirectionVector);
    else
        vAux = this.rotate90CW(boatDirectionVector);
    this.normalize(vAux);
    circle.x0 = this._body.position[0] + vAux.x * circle.radius;
    circle.y0 = this._body.position[1] - vAux.y * circle.radius;
    return circle;
};

// v and v2 in normal coordinates
InputComponent.prototype.rotate90CCW = function (v) {
    var v2 = {
        'x': -v.y,
        'y': v.x
    };
    return v2;
};

// v and v2 in normal coordinates
InputComponent.prototype.rotate90CW = function (v) {
    var v2 = {
        'x': v.y,
        'y': -v.x
    };
    return v2;
};

// Boat direction vector in normal coordinates ( y in correct direction )
InputComponent.prototype.getBoatDirectionVector = function (command) {
    var boat_vector = {
        'x': Math.cos(this._body.angle),
        'y': -Math.sin(this._body.angle)
    };
    return boat_vector;
};

// Boat to clicked point direction vector in normal coordinates
InputComponent.prototype.getBoatToClickedPointVector = function (command) {
    var boat_to_point_vector = {};
    boat_to_point_vector.x = command.mouseWorldX - this._body.position[0];
    boat_to_point_vector.y = -(command.mouseWorldY - this._body.position[1]);
    this.normalize(boat_to_point_vector);
    return boat_to_point_vector;
};

// v1 and v2 in normal coordinates
InputComponent.prototype.v1ReachV2RotatingOnCounterClockWise = function (v1, v2) {
    return this.crossProduct(v1, v2) > 0;
};

// v1 and v2 in normal coordinates
InputComponent.prototype.crossProduct = function (v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
};

// Return diference angle(degree) between finalAngle(degree) and currentAngle(degree)
// Return value is greater than zero: currentAngle reach finalAngle on clockWise direction
// Return value is less than zero: currentAngle reach finalAngle on counterClockWise direction
// InputComponent.prototype.getDeltaAngleFromAngles = function( finalAngle, currentAngle ){
//     var delta = (finalAngle - currentAngle)%360;
//     if( delta > 180 )
//         delta -= 360;
//     if( delta < -180 )
//         delta += 360;
//     return delta;
// };

// Input vectors in world coordinates
// Return diference angle(degree) between finalVector and currentVector
// Return value is greater than zero: currentVector reach finalVector on clockWise direction
// Return value is less than zero: currentVector reach finalVector on counterClockWise direction
InputComponent.prototype.getDeltaAngleFromVectors = function (finalVector, currentVector) {
    var finalAngle = this.getAngleFromVector(finalVector);
    var currentAngle = this.getAngleFromVector(currentVector);
    var delta = (finalAngle - currentAngle) % (2 * Math.PI);
    if (delta > Math.PI)
        delta -= (2 * Math.PI);
    if (delta < -Math.PI)
        delta += (2 * Math.PI);
    return delta;
};

// The v vector is in world coordinates
// The returned angle is positive in the clock-wise direction because of the world coordinate system
// The returned angle is in degree
InputComponent.prototype.getAngleFromVector = function (v) {
    var angle = Math.asin(this.normalize(v).y);
    if (v.x < 0)
        angle = Math.PI - angle;
    return angle;
};

// Angle in degree and in world coordinates
// The returned vector is in normal coordinates
InputComponent.prototype.getVectorFromAngle = function (angle) {
    var v = {
        'x': Math.cos(angle),
        'y': -Math.sin(angle) ///////////////////////////////////////////////////////////////////////////
    };
    return v;
};

InputComponent.prototype.normalize = function (v) {
    var mod = this.module(v);
    v.x /= mod;
    v.y /= mod;
    return v;
};

InputComponent.prototype.module = function (v) {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
};

module.exports = InputComponent;