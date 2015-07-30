'use strict';

var _enum = require('../../shared/utils/enum.js');

var RoomStatesEnum = _enum({
	LOBBY: 0,
	LOBBY_ALL_READY: 1,
	LOBBY_TRANSITION: 2,
	GAME: 3,
	END_GAME: 4
});


module.exports = RoomStatesEnum;