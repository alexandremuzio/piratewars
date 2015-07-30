'use strict';

var _enum = require('../../shared/utils/enum.js');

var GameStatesEnum = _enum({
	PRE_GAME: 0,
	PLAYING: 1,
	END_GAME: 2,
	DONE: 3
});


module.exports = GameStatesEnum;