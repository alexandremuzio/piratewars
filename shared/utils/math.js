'use strict';

var MathUtils = {
	// angle in degree
	vector : function(norm, angle) {
		return {
			'x' : norm * Math.cos(angle),
			'y' : norm * Math.sin(angle)
		};
	},

	// v = { x: ?, y: ? } is in world coordinates
	// The returned angle is positive in the clock-wise direction because of the world coordinate system
	// The returned angle is in degree
	getAngleFromVector : function(v) {
		var angle = Math.asin(this.normalize(v).y);
	    if( v.x < 0 )
	        angle = Math.PI - angle;
	    return angle;
	},

	normalize : function(v){
	    var mod = this.module(v);
	    v.x /= mod;
	    v.y /= mod;
	    return v;
	},

	module : function(v){
	    return Math.sqrt(v.x*v.x + v.y*v.y);
	},
};

module.exports = MathUtils;