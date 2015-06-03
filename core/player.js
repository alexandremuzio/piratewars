var p2 = require('p2');
var player_properties = require('./player_properties.json');

// Player class including a phaser object (not used on the server) and
// a body object (used by p2 physics engine)
function Player (gameCore, uuid, radius) {
    this.gameCore = gameCore; //reference to physics world
    this.phaser = null;
    this.radius = radius; // Change the circle radius to detect collision
    this.body = new p2.Body({
        name: "player",
        mass: 1,
        position: [100, 100]
    });
    this.body.addShape(new p2.Circle(this.radius));
    this.body.damping = player_properties.linear_damping;
    this.body.angularDamping = player_properties.angular_damping;
    this.body.angle = 0;

    this.bulletsShot = [];

    // Auxiliar variables to move player on 'click_and_go' mode
    this.x_to_go;
    this.y_to_go;
    this.angle_to_go;
    this.dir_to_go;
    this.already_reach_angle_to_go;
    this.going_to_new_point;
    this.clock_wise;
}

Player.prototype.shootProjectile = function() {
    console.log("Shooting Projectile!");
    // var newBullet = new Bullet();

    // this.bulletsShot.push(new Bullet());
    // this.gameCore.world.addBody(newBullet.body);
}

Player.prototype.update = function(playerInput) {
    this.updateMove(playerInput);
}

// Update the body.position and body.angle of player based on your input ( playerInput )
Player.prototype.updateMove = function(playerInput){
    if( player_properties.move_mode === "by_arrows" ){
        if (playerInput.Key_LEFT) {
            this.body.angularForce = -player_properties.angular_force;
        }
        if (playerInput.Key_RIGHT) {
            this.body.angularForce = player_properties.angular_force;
        }
        if (playerInput.Key_UP) {
            this.body.force[0] = player_properties.linear_force*Math.cos(this.body.angle*Math.PI/180);
            this.body.force[1] = player_properties.linear_force*Math.sin(this.body.angle*Math.PI/180);
        }
        if (playerInput.Key_SPACEBAR) {
            this.shootProjectile();
        }
    }
    else if( player_properties.move_mode === "click_and_go" ){
        /*
        // Initialize auxiliar variables to go to new point when player clicked
        if( playerInput.Mouse_DOWN ){
            // ( dx, dy ) : direction to go, |( dx, dy )| = 1
            var dx = playerInput.Mouse_X - this.body.position[0];
            var dy = playerInput.Mouse_Y - this.body.position[1];
            var mod = Math.sqrt(dx*dx + dy*dy);
            dx /= mod;
            dy /= mod;
            var angle = Math.asin(dy)*180/Math.PI;
            if( dx < 0 )
                angle = 180 - angle;
            if( angle > 180 )
                angle -= 360;

            this.x_to_go = playerInput.Mouse_X;
            this.y_to_go = playerInput.Mouse_Y;
            this.angle_to_go = angle;
            this.dir_to_go = [dx, dy];
            this.already_reach_angle_to_go = false;
            this.going_to_new_point = true;
            if( this.body.angle < angle )
                this.clock_wise = false;
            else
                this.clock_wise = true;

            console.log("this.angle_to_go = " + this.angle_to_go);
            console.log("this.body.angle = " + this.body.angle);
        }
        // Update when player is going to new point
        if( this.going_to_new_point ){
            // Still spinning
            if(!this.already_reach_angle_to_go){
                if( this.clock_wise ){
                    if( this.body.angle > this.angle_to_go )
                        this.body.angularForce = player_properties.angular_force;
                    else{
                        this.body.angle = this.angle_to_go;
                        this.already_reach_angle_to_go = true;
                    }
                }
                else{
                    if( this.body.angle < this.angle_to_go )
                        this.body.angularForce = -player_properties.angular_force;
                    else{
                        this.body.angle = this.angle_to_go;
                        this.already_reach_angle_to_go = true;
                    }
                }
            }
            // Finish spinning and moving to the new point
            else{

            }
        }
        */         
    }
    else{
        console.log("player_properties.move_mode must be \"by_arrows\" or \"click_and_go\"");
    }
}

module.exports =  Player;