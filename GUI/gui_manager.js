'use strict';

var LobbyGUI = require('./lobby.json');
var RespawnGUI = require('./respawn.json');
var EndGameGUI = require('./end_game.json');

function GUIManager() {

}

GUIManager.prototype.startGUI = function () {
    EZGUI.Theme.load(['assets/GUI/metalworks-theme/metalworks-theme.json'], function () {
        this.setupGUI();
    }.bind(this));
};

GUIManager.prototype.setupGUI = function () {
    var respawnScreen = EZGUI.create(RespawnGUI.respawn, 'metalworks');
    respawnScreen.visible = false;

    var lobbyScreen = EZGUI.create(LobbyGUI.lobby, 'metalworks');
    lobbyScreen.visible = false;

    var endGameScreen = EZGUI.create(EndGameGUI.endGame, 'metalworks');
    endGameScreen.visible = false;
    //EZGUI.components.respawnTime.text = '9';
};

module.exports = GUIManager;
