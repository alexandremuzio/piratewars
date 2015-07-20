'use strict';

var _enum = require('../../shared/utils/enum.js');

var GameStatesEnum = _enum({
	PREGAME: 0,
	PLAYING: 1,
	POSTGAME: 2
});


module.exports = GameStatesEnum;