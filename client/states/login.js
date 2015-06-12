'use strict'

var _ = require('underscore');
var GameEngine = require('../../shared/game_engine.js');
var EntityFactory = require('../core/entity_factory.js');
var GameComponent = require('../../shared/core/component.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');

//Private variables
var thisGame;
var nextState;

function LoginState(game, state) {
    thisGame = game;
    nextState = state;
};

///
LoginState.prototype = Object.create(Phaser.State.prototype);
LoginState.prototype.constructor = LoginState;

///
//Phaser Methods

//Init is the first function called when starting the State
//Parameters comes from game.state.start()
LoginState.prototype.init = function() {};

LoginState.prototype.preload = function() {
    //this.setPhaserPreferences();
    this.loadAssets();
};

LoginState.prototype.create = function() {
    this.addNextStateEvents();
};

LoginState.prototype.addNextStateEvents = function() {
    document.getElementById("loginbtn").addEventListener("click", function() {
        document.getElementById("initialScreen").style.display = "none";
        var nickname = document.getElementById("nickname").value;
        thisGame.state.start(nextState, true, false, nickname);
    });

    document.getElementById('nickname').addEventListener('keydown', function(event) {
        if (event.keyCode == 13) {
            console.log('Pressed enter');
            document.getElementById("initialScreen").style.display = "none";
            var nickname = document.getElementById("nickname").value;
            thisGame.state.start(nextState, true, false, nickname);
        }
    });
};

LoginState.prototype.loadAssets = function() {
    thisGame.load.tilemap('backgroundmap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    thisGame.load.image('gameTiles', 'assets/watertile.png');
    thisGame.load.image('boat_0', 'assets/boat_0.png');
    thisGame.load.image('bullet', 'assets/bullet.png');
};

module.exports = LoginState;