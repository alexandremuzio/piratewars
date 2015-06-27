'use strict'

var MathUtils = {
	// angle in degree
	vector : function(norm, angle) {
		return {
			"x" : norm * Math.cos(angle*Math.PI/180),
			"y" : norm * Math.sin(angle*Math.PI/180)
		}
	},

	// v = { x: ?, y: ? } is in world coordinates
	// The returned angle is positive in the clock-wise direction because of the world coordinate system
	// The returned angle is in degree
	getAngleFromVector : function(v) {
		var angle = Math.asin(this.normalize(v).y)*180/Math.PI;
	    if( v.x < 0 )
	        angle = 180 - angle;
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