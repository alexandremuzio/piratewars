'use strict'

var _ = require('underscore');
var GameEngine = require('../../shared/game_engine.js');
var PlayerFactory = require('../core/player_factory.js');
var GameComponent = require('../../shared/core/component.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');
var RespawnJSON = require('../../GUI/game-gui.js');
var LobbyJSON = require('../../GUI/lobby-gui.js');


function LobbyState(game, socket, state) {
    this.game = game;
    this.socket = socket;
    this.nextState = state;

    this.clientName = {};
    this._lobbyInfo = {};
    this._ready = false;
    this._currentState = "lobby";

    console.log("Inside Lobby!");
};

///
LobbyState.prototype = Object.create(Phaser.State.prototype);
LobbyState.prototype.constructor = LobbyState;


LobbyState.prototype.init = function() {};

LobbyState.prototype.preload = function() {
};

LobbyState.prototype.create = function() {
    this.showLobbyGUI();
    this.assignNetworkCallbacks();
    this.addStateEvents();
};


LobbyState.prototype.update = function() {
    if (this._currentState == 'pregame') {
        this.game.state.start(this.nextState, true, false);
    }

    _.each(this._lobbyInfo.teams, function(team) {

        for (var i = 1; i <= team.length; i++) {
            var player = team[i - 1];
            EZGUI.components[player.name].text = player.name;

            if (team.ready) {
                EZGUI.components[player.name].font.color = 'green'; //////////////
            }

            else {
                EZGUI.components[player.name].font.color = 'red'; /////////////
            }
        }
    });
}

LobbyState.prototype.assignNetworkCallbacks = function() {
    this.socket.on('client.name', this.onReceiveClientName.bind(this));
    this.socket.on('lobby.info', this.onLobbyInfo.bind(this));
    this.socket.on('game.state', this.onGameState.bind(this));
}

LobbyState.prototype.onReceiveClientName = function(clientName) {
    this._clientName = clientName;
}

LobbyState.prototype.onLobbyInfo = function(lobbyInfo) {
    this._lobbyInfo = lobbyInfo;
}

LobbyState.prototype.onGameState = function (gameState) {
    this._currentState = gameState;
}

LobbyState.prototype.addStateEvents = function() {

    //change team button TO DO
    EZGUI.components.readyButton.on('click', function () {
        if (this._currentState == 'lobby') {
            this._ready = this._ready ^ 1;
            this.socket.emit('player.ready', this._ready);
        }
    }.bind(this));


    //ready button
    EZGUI.components.readyButton.on('click', function () {
        if (this._currentState == 'lobby') {
            this._ready = this._ready ^ 1;
            this.socket.emit('player.ready', this._ready);
        }
    }.bind(this));
}

LobbyState.prototype.showLobbyGUI = function() {
    EZGUI.components.lobby.visible= true;
}


module.exports = LobbyState;