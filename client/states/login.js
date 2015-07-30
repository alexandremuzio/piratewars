'use strict';

var GUIManager = require('../../gui/gui_manager');

function LoginState() {
    this.guiManager = new GUIManager();
    console.log(this);
}

///
LoginState.prototype = Object.create(Phaser.State.prototype);
LoginState.prototype.constructor = LoginState;
///

//Phaser Methods

//Init is the first function called when starting the State
//Parameters comes from game.state.start()
LoginState.prototype.init = function () { };

LoginState.prototype.preload = function () {
    this.setPhaserPreferences();
    this.loadAssets();
    // Enable phaser to run its steps even on an unfocused window
    this.stage.disableVisibilityChange = true;
};

LoginState.prototype.create = function () {
    this.guiManager.startGUI();
    this.addNextStateEvents();

    this.music = this.add.audio('themesong');
    this.music.loop = true;
    //this.music.play(); ///////
};

LoginState.prototype.setPhaserPreferences = function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setMinMax(1024 / 2, 672 / 2, 1024 * 2, 672 * 2);

    // Enable phaser to run its steps even on an unfocused window
    this.stage.disableVisibilityChange = true;

    // Enable FPS of game shown on the screen
    this.time.advancedTiming = true;
};

//Add next state functions to Enter Key or Login button
LoginState.prototype.addNextStateEvents = function () {
    var that = this;
    document.getElementById('loginbtn').addEventListener('click', function () {
        document.getElementById('initialScreen').style.display = 'none';
        var nickname = document.getElementById('nickname').value;
        that.state.start('lobby', true, false, nickname);
    }.bind(this));

    document.getElementById('nickname').addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            console.log('Pressed enter');
            document.getElementById('initialScreen').style.display = 'none';
            var nickname = document.getElementById('nickname').value;
            that.state.start('lobby', true, false, nickname);
        }
    }.bind(this));
};

//Switch to next state
LoginState.prototype.switchState = function (param) {
    console.log('Going to ' + this.nextState);
    this.state.start(this.nextState, true, false, param);
};

LoginState.prototype.loadAssets = function () {
    /* ------------- health bar assets -----------------*/
    this.load.image('blackbox', 'assets/blackbox.png');
    this.load.image('redbar', 'assets/redbar.png');
    /* ------------------------------------------------ */

    //Spritesheet (name, directory, width of each sprite, height of each, how many sprites)
    this.load.spritesheet('dead_boat', 'assets/dead_boat.png', 306, 107, 2);

    this.load.tilemap('backgroundmap', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/watertile.png');
    this.load.image('boat_3', 'assets/boat_3.png');
    this.load.image('boat_4', 'assets/boat_4.png');
    this.load.image('boat_3-dead', 'assets/boat_3.png');
    this.load.image('boat_4-dead', 'assets/boat_4.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('red_arrow', 'assets/red_arrow.png');
    this.load.image('base-pirate', 'assets/base-pirate.png');
    this.load.image('base-navy', 'assets/base-navy.png');
    this.load.image('cannon_0', 'assets/cannon_0.png');
    this.load.image('mask', 'assets/mask.png');
    this.load.image('mine', 'assets/mine.png');

    /* ----------------- GUI assets --------------------*/
    this.load.image('lvlcomplete', 'assets/GUI/img/lvlcomplete.png');
    this.load.image('respawnDialogBox', 'assets/GUI/img/respawnDialogBox.png');
    this.load.image('star2', 'assets/GUI/img/star2.png');
    this.load.image('orange-btn', 'assets/GUI/img/orange-btn.png');
    this.load.image('wood_tile', 'assets/GUI/img/wood_tile.png');
    /* ------------------------------------------------ */

    /* ----------------- Audio assets --------------------*/
    this.load.audio('themesong', ['assets/audio/gametheme.mp3']);
    this.load.audio('canon', ['assets/audio/cannonsound.mp3']);
};

module.exports = LoginState;