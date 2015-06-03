var p2 = require('p2');

Bullet = function(x, y) {
	this.phaser = null;

	this.body = new p2.Body({
		name: "bullet",
        mass: 1,
        position: [x, y]
    });

    // this.body.velocity[0] = 10;
    // this.body.velocity[1] = 10;
};


module.exports = Bullet;