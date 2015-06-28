'use strict'

var Game = require('./game.js');
var $ = require('jquery');
var socket = io.connect();
var PlayerFactory = require('./core/player_factory.js');
var id;
var gameInstance;

socket.on('connect', function() {
    console.log("Connecting!");
});

var run = function() {
	// remove the canvas if it was already created
    // this may happen if the server gets restarted mid-game
    $('canvas').remove();
	gameInstance = new Game(socket);
}

socket.on('onconnected', function(data) {
	run();
    console.log("Connected! Running game.");
});