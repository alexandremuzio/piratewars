'use strict'

var GameComponent = require('../core/component.js');

function Player() {
};

///
Player.prototype = Object.create(GameComponent.prototype);
Player.prototype.constructor = Player;
///

/**
 * @override
 */
// Player.prototype.update = function() {
// }

module.exports = Player;