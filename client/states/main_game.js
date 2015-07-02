'use strict'

var _ = require('underscore');
var GameEngine = require('../../shared/game_engine.js');
var PlayerFactory = require('../core/player_factory.js');
var ProjectileFactory = require('../core/projectile_factory.js');
var GameComponent = require('../../shared/core/component.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');

//To debug
/*var spawn_settings = require('../../shared/settings/spawn_positions.json');
var player_settings = require('../../shared/settings/player.json');*/

function PlayState(game, socket, nextState) {
    this.game = game;

    // console.log("In PlayState constructor");
    if(this.game) console.log("this.game setted");
    
    this.outSnapshotManager = new SnapshotManager();
    this.snapshot = null;
    this.socket = socket;
    this.selfPlayer = null;
    this.numberOfConnectedPlayers = 1;
    this._state = null;

    this._currentState = 'preState';
    this._nextState = nextState;
    this._gameResults;

    var data = { game:      this.game,
                 socket:    this.socket };

    PlayerFactory.init(data);
    ProjectileFactory.init(data);
};


///
PlayState.prototype = Object.create(Phaser.State.prototype);
PlayState.prototype.constructor = PlayState;

///
//Phaser Methods

//Init is the first function called when starting the State
//Param comes from game.state.start()
PlayState.prototype.init = function(param) {
    // console.log(param);
};

PlayState.prototype.preload = function() {
};

PlayState.prototype.create = function() {
    
    this.game.world.setBounds(0, 0, 2000, 2000);
    this.assignAssets();
    //this.game.map.setCollisionBetween(1, 100000, true, 'islandsLayer');
    this.createTexts();
    this.createInitialEntities(); 
    this.assignNetworkCallbacks();
    // setInterval(this.debugUpdate.bind(this), 1000);
    this.socket.emit('player.ready');
};

//update loop - runs at 60fps
PlayState.prototype.update = function() {
    var lastSnapshot = this.outSnapshotManager.getLast();
    this.applySyncFromServer(lastSnapshot);

    //Go back to lobby
    if (this._currentState == 'lobby'){
        // this.game.state.start(this._nextState, true, false); ////////////////////////
    }
    GameEngine.getInstance().gameStep();
    this.applySyncFromServerAfter(lastSnapshot);
    this.outSnapshotManager.clear();
};

PlayState.prototype.render = function() {
    this.updateTexts();
};

//////////////////////////////////////
// Functions in alphabetical order: //
//////////////////////////////////////
PlayState.prototype.applySyncFromServer = function(lastSnapshot) {
    // console.log("Starting applySyncFromServer");
    // console.log(lastSnapshot);
    if (lastSnapshot) {
        // console.log("snapshot true");
        for (var key in lastSnapshot.players) {
            // console.log("for var key in snapshot", key);
            if (!GameEngine.getInstance().entities[key]) {
                // console.log("creating remote player");
                PlayerFactory.createRemotePlayer({ id: key });
            }
            GameEngine.getInstance().entities[key].sync(lastSnapshot.players[key]);
        }
        for (var key in lastSnapshot.bullets) {
            if (!GameEngine.getInstance().entities[key]) {
                // console.log("creating remoteBullet");
                ProjectileFactory.createRemoteBullet(lastSnapshot.bullets[key]);
            }
            else {
                // console.log("syncing localBullet");
                GameEngine.getInstance().entities[key].sync(lastSnapshot.bullets[key]);
            }
        }
        for (var key in lastSnapshot.mines) {
            if (!GameEngine.getInstance().entities[key]) {
                // console.log("creating remoteBullet");
                ProjectileFactory.createRemoteMine(lastSnapshot.mines[key]);
                // console.log('mine ' + key + ' created');
                // GameEngine.getInstance().printEntityHierarchy();
            }
            else {
                // console.log("syncing localBullet");
                GameEngine.getInstance().entities[key].sync(lastSnapshot.mines[key]);
            }
        }
    }
}

PlayState.prototype.applySyncFromServerAfter = function(lastSnapshot) {
    // console.log("Starting applySyncFromServer");
    // console.log(lastSnapshot);
    if (lastSnapshot) {
        // console.log("snapshot true");
        for (var key in lastSnapshot.players) {
            // console.log("for var key in snapshot", key);
            GameEngine.getInstance().entities[key].syncAfter(lastSnapshot.players[key]);
        }

        if( lastSnapshot.mineCollisions ){
            _.each( lastSnapshot.mineCollisions, function(mineCollision){
                var mine = GameEngine.getInstance().entities[mineCollision.mineId];
                if( mine ){
                    console.log('Has new mine/player collision on server and client does not detected it');
                    var mineController = mine.components.get('mine_controller');
                    var player = GameEngine.getInstance().entities[mineCollision.playerId];
                    mineController.forceCollision(player);
                }
            });
        }

        for (var key in lastSnapshot.strongholds) {
            GameEngine.getInstance().entities[key].syncAfter(lastSnapshot.strongholds[key]);
        }
    }
}

PlayState.prototype.assignAssets = function() {  
    this.game.map = this.game.add.tilemap('backgroundmap');
    this.game.map.addTilesetImage('watertile', 'gameTiles');
    this.game.backgroundlayer = this.game.map.createLayer('backgroundLayer');
    this.game.blockedLayer = this.game.map.createLayer('islandLayer');
    
    this.game.mask = this.game.add.sprite(0, 0, 'mask');
    this.game.mask.kill();
    this.game.mask.fixedToCamera = true;

    //To debug
    /*for(var i = 0; i < 5; i++) {
        var sprite = this.game.add.sprite(spawn_settings.teams[1].positions[i].x,
            spawn_settings.teams[1].positions[i].y,
            'boat_0')
        sprite.angle = spawn_settings.teams[1].positions[i].angle*180/3.1415;
        sprite.width = player_settings.width,
        sprite.height = player_settings.height,
        sprite.anchor.x = 0.5,
        sprite.anchor.y = 0.5
    }*/
}

PlayState.prototype.assignNetworkCallbacks = function() {   
    this.socket.on('game.sync', this.onGameSync.bind(this));
    this.socket.on('game.state', this.onGameState.bind(this));
    this.socket.on('player.create', this.onPlayerCreate.bind(this));
    this.socket.on('game.initialInfo', this.onGameStart.bind(this));
    this.socket.on('game.results', this.onGameResults.bind(this));
}

PlayState.prototype.createInitialEntities = function() {
    // Create turrets, bases, creeps...
    PlayerFactory.createStronghold(0);
    PlayerFactory.createStronghold(1);
}

PlayState.prototype.createTexts = function() {
    // Creating debug text
    // this.text = this.game.add.text(0, 0, "0 Players Connected", {
    //     font: "20px Arial",
    //     fill: "#ff0044",
    //     align: "center"
    // });
    // this.text.fixedToCamera = true;
    // this.text.cameraOffset.setTo(310,100);

    this.fpsText = this.game.add.text(0, 0, "FPS: 0", {
        font: "12px Arial",
        fill: "#000000",
        align: "center"
    });
    this.fpsText.fixedToCamera = true;
    this.fpsText.cameraOffset.setTo(750,10);
}

PlayState.prototype.debugUpdate = function() {    
    /////////////////// NOOOOO!!! FIND A WAY TO REMOVE THIS IF, PLEASE!!!
    if (this.selfPlayer) {
        console.log("");
        console.log("STARTING applySyncFromServer");
        this.applySyncFromServer();;
        console.log("ENDING applySyncFromServer");
        console.log("STARTING gameStep");
        GameEngine.getInstance().gameStep();
        console.log("ENDING gameStep");
        console.log("STARTING emit");
        console.log("ENDING emit");
    }
};

PlayState.prototype.onGameResults = function(results) {
    this._gameResults = results;
}

PlayState.prototype.onGameState = function(state) {
    if(this._state != state) {
        if(state == 'preGame') this.preGame();
        else if(state == 'endGame') this.endGame();
        else if(state == 'playing') this.startPlaying();
        this._state = state;
    }
}

PlayState.prototype.preGame = function() {
    if(!this.game.mask.alive) {
        this.game.mask.revive();
        this.game.mask.alpha = 0.5;
    }
}

PlayState.prototype.startPlaying = function() {
    if(this.game.mask.alive) this.game.mask.kill();
}

PlayState.prototype.endGame = function() {
    if(!this.game.mask.alive) {
        this.game.mask.revive();
        this.game.mask.alpha = 0.5;
    }
    var egt = EZGUI.components.endGameText;
    egt.visible = true;
    egt.alpha = 0;
    egt.animateFadeIn(500, EZGUI.Easing.Linear.None);
}

PlayState.prototype.onGameSync = function(snapshot) {
    this.outSnapshotManager.add(snapshot);
}

PlayState.prototype.onGameStart = function(initialGameInfo) {
    console.log(initialGameInfo);
    _.each(initialGameInfo, function(remotePlayerData, key) {
        remotePlayerData.id = key;
        PlayerFactory.createRemotePlayer(remotePlayerData);
    });
}

PlayState.prototype.onGameState = function(currentState) {
    this._currentState = currentState;
    console.log(this._currentState);
}

PlayState.prototype.onPlayerCreate = function(data) {    
    console.log("Creating a new player!");
    this.selfPlayer = PlayerFactory.createLocalPlayer(data);
    this.game.camera.follow(this.selfPlayer.components.get("sprite").getSprite('boat'));

    // MPTest
    GameEngine.getInstance().printEntityHierarchy();
}

PlayState.prototype.updateTexts = function() {
    // Debugging purposes
    // this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.fpsText.setText("FPS: " + this.game.time.fps);
}

module.exports = PlayState;