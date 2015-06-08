'use strict'

var Game = require('./game.js');

var socket = io.connect();
var id;

socket.on('connect', function() {
    console.log("Connecting!");
});

function run() {
	this.gameInstance = new Game(socket);
}

socket.on('onconnected', function(data) {
	run();
    console.log("Connected! Running game.");
});