'use strict'

function _enum(list) {       
    for (var key in list) {
        list[list[key] = list[key]] = key;
    }
    if (Object.freeze) {
    	return Object.freeze(list);
    }
    else return Object;
}

var PlayerEnum = _enum({
	PRE_GAME: 0,
	ALIVE: 1,
	DEAD: 2,
    END_GAME: 3
});


module.exports = PlayerEnum;