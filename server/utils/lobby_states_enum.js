'use strict';

var _enum = require('../../shared/utils/enum.js');

var LobbyStatesEnum = _enum({
	START: 0,
	ALL_READY: 1,
	TRANSITION: 2,
	DONE: 3
});


module.exports = LobbyStatesEnum;