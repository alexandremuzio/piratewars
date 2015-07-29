'use strict';

var LoginState = require('./states/login');
var LobbyState = require('./states/lobby');
var PlayState = require('./states/main_game');

function Game(socket) {
    this.game = new Phaser.Game(1000, 450, Phaser.CANVAS, '');
    this.game.state.add('login', new LoginState());
    this.game.state.add('lobby', new LobbyState(socket));
    this.game.state.add('play', new PlayState(socket));
    console.log('States loaded');

    this.game.state.start('login', true /*clear world*/, false /*clear cache*/);
}

module.exports = Game;