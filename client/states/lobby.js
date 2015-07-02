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

    this._firstTime = true;
    this.clientName = {};
    this._lobbyInfo = {};
    this._ready = false;
    this._currentState = "lobby";

    console.log("Inside Lobby!");
};

///
LobbyState.prototype = Object.create(Phaser.State.prototype);
LobbyState.prototype.constructor = LobbyState;


LobbyState.prototype.init = function(clientName) {
    this._clientName = clientName;
};

LobbyState.prototype.preload = function() {
    console.log('in preload!');
    this.socket.emit('client.name', this._clientName);
};

LobbyState.prototype.create = function() {
    if (this._firstTime) {
        console.log("Test");
        this.assignNetworkCallbacks();
        this.addStateEvents();
        this.showLobbyGUI();
    }
    this.clearGUI();
    this._firstTime = false;
    console.log("in create!");
};


LobbyState.prototype.update = function() {
    this.showLobbyGUI();
    // console.log(EZGUI.components);
    if (this._currentState == 'preGame') {
        this.clearGUI();
        EZGUI.components.lobby.visible= false;
        this.game.state.start(this.nextState, false, false);
    }

    _.each(this._lobbyInfo.teams, function(team, teamKey) {

        for (var i = 1; i <= team.length; i++) {
            var player = team[i - 1];
            // console.log(team);
            // console.log(teamKey);
            EZGUI.components[teamKey + "slot" + i].text = player.name;

            if (player.ready) {
                // EZGUI.components[teamKey + "slot" + i].font.color = 'green'; //////////////
                EZGUI.components[teamKey + "slot" + i].text = player.name + " ready";
            }

            else {
                // EZGUI.components[teamKey + "slot" + i].font.color = 'red'; /////////////
                EZGUI.components[teamKey + "slot" + i].text = player.name + " not ready";
            }
        }
    });
}

LobbyState.prototype.clearGUI = function() {
    for (var i = 1; i <= 5; i++) {
        EZGUI.components["redslot" + i].text = "";
        EZGUI.components["blueslot" + i].text = "";
    }
}

LobbyState.prototype.assignNetworkCallbacks = function() {
    this.socket.on('lobby.info', this.onLobbyInfo.bind(this));
    this.socket.on('game.state', this.onGameState.bind(this));
}

LobbyState.prototype.onReceiveClientName = function(clientName) {
    this._clientName = clientName;
}

LobbyState.prototype.onLobbyInfo = function(lobbyInfo) {
    console.log(lobbyInfo);
    this.clearGUI();
    this._lobbyInfo = lobbyInfo;
}

LobbyState.prototype.onGameState = function (gameState) {
    this._currentState = gameState;
}

LobbyState.prototype.addStateEvents = function() {
    //change team button TO DO
    EZGUI.components.switchTeamButton.on('click', function () {
        console.log('clicked switch!');
        if (this._currentState == 'lobby') {
            if (this._lobbyInfo.selfTeam == "red") {
                this.socket.emit('client.changeTeam', "blue");
            }

             if (this._lobbyInfo.selfTeam == "blue") {
                this.socket.emit('client.changeTeam', "red");
            }
        }
    }.bind(this));


    //ready button
    EZGUI.components.readyButton.on('click', function () {
        console.log("clicked ready!");
        if (this._currentState == 'lobby') {
            this._ready = Boolean(this._ready ^ 1);
            this.socket.emit('client.ready', this._ready);
        }
    }.bind(this));
}

LobbyState.prototype.showLobbyGUI = function() {
    EZGUI.components.lobby.visible= true;
}


module.exports = LobbyState;