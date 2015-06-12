'use strict'

var LoginState = require('./states/login.js');
var PlayState = require('./states/main_game.js');

function Game(socket) {
    this.game = new Phaser.Game(800, 450, Phaser.CANVAS, "");
    this.game.state.add('login', new LoginState(this.game, 'play' /*next state*/));
    this.game.state.add('play', new PlayState(this.game, socket));
    console.log("States loaded");

    this.game.state.start('login', true /*clear world*/, false /*clear cache*/);
}

module.exports = Game;