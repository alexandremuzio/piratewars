'use strict'

var MathUtils = {
	vector : function(norm, angle) {
		return {
			x : norm * Math.cos(angle*Math.PI/180),
			y : norm * Math.sin(angle*Math.PI/180)
		}
	}
};

module.exports = MathUtils;