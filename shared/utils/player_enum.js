'use strict';

var _enum = require('./enum.js');

var PlayerEnum = _enum({
	PRE_GAME: 0,
	ALIVE: 1,
	DEAD: 2,
    END_GAME: 3
});


module.exports = PlayerEnum;