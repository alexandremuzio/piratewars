'use strict';

function _enum(list) {       
    for (var key in list) {
        list[list[key] = list[key]] = key;
    }
    if (Object.freeze) {
    	return Object.freeze(list);
    }
    else return Object;
}

module.exports = _enum;