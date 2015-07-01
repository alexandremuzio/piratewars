'use strict'

var _ = require('underscore');
var GameEngine = require('../../shared/game_engine.js');
var PlayerFactory = require('../core/player_factory.js');
var GameComponent = require('../../shared/core/component.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');
var RespawnJSON = require('../../GUI/game-gui.js');

//Private variables
var nextState;

function LoginState(game, state) {
    this.game = game;
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
    this.loadTheme();
    this.setupGUI();
    this.addNextStateEvents();
};

//Add next state functions to Enter Key or Login button
LoginState.prototype.addNextStateEvents = function() {
    var that = this.game;
    document.getElementById("loginbtn").addEventListener("click", function() {
        document.getElementById("initialScreen").style.display = "none";
        var nickname = document.getElementById("nickname").value;
        that.state.start(nextState, true, false, nickname);
    });

    document.getElementById('nickname').addEventListener('keydown', function(event) {
        if (event.keyCode == 13) {
            console.log('Pressed enter');
            document.getElementById("initialScreen").style.display = "none";
            var nickname = document.getElementById("nickname").value;
            that.state.start(nextState, true, false, nickname);
        }
    });
};

//Switch to next state
LoginState.prototype.switchState = function(param) {
    console.log('Going to ' + nextState);
    this.game.state.start(nextState, true, false, param);
}

LoginState.prototype.loadAssets = function() {
    /* ------------- health bar assets -----------------*/
    this.game.load.image('blackbox', 'assets/blackbox.png');
    this.game.load.image('redbar', 'assets/redbar.png');
    /* ------------------------------------------------ */

    //Spritesheet (name, directory, width of each sprite, height of each, how many sprites)
    this.game.load.spritesheet('dead_boat', 'assets/dead_boat.png', 306, 107, 2);

    this.game.load.tilemap('backgroundmap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('gameTiles', 'assets/watertile.png');
    this.game.load.image('boat_0', 'assets/boat_0.png');
    this.game.load.image('bullet', 'assets/bullet.png');
    this.game.load.image('red_arrow', 'assets/red_arrow.png');
    this.game.load.image('stronghold', 'assets/stronghold.png');
    this.game.load.image('cannon_0', 'assets/cannon_0.png');
    
    /* ----------------- GUI assets --------------------*/
    this.game.load.image('lvlcomplete', 'assets/GUI/img/lvlcomplete.png');
    this.game.load.image('respawnDialogBox', 'assets/GUI/img/respawnDialogBox.png');
    this.game.load.image('star2', "assets/GUI/img/star2.png");
    this.game.load.image('orange-btn', "assets/GUI/img/orange-btn.png");
    /* ------------------------------------------------ */
};

LoginState.prototype.loadTheme = function() {
    EZGUI.Theme.load(['assets/GUI/metalworks-theme/metalworks-theme.json'], function () {
        var dlg1  = EZGUI.create(RespawnJSON, 'metalworks');
        dlg1.visible=false;
    
        //EZGUI.components.respawnTime.text = '9';
    });
};

LoginState.prototype.setupGUI = function() {
//    EZGUI.components.
}

module.exports = LoginState;