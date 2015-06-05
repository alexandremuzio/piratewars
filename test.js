'use strict'

var GameEngine = require('./core/game_engine.js');
var Entity = require('./core/entity.js');
var GameComponent = require('./core/game_component.js');
var Player = require('./core/player.js')

// console.log(GameEngine);

// var a = GameEngine.getInstance();
// var b = GameEngine.getInstance();

// a.getValue();
// b.getValue();
// a.getValue();
// b.getValue();
// a.getValue();

var p = new Player();

setInterval( function() {
	GameEngine.getInstance().gameStep();	
}, 1000);


// var e = new Entity();
// var c = new GameComponent();
// Entity.constructor();
// console.log(e.constructor);
// var go = new GameComponent();
// var p = new Player();

// console.log(e.constructor);

// e.update();
// p.update();