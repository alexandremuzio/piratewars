'use strict';

var
    io          = require('socket.io'),
    express     = require('express'),
    UUID        = require('node-uuid'),
    http        = require('http'),
    path        = require('path'),
    app         = express(),
    game_core   = require('../core/game_core.js'),
    server      = http.createServer(app),

    config      = require('./config.json'),
    verbose     = false,
    webRoot, gameCore;



// resolve the path to the web root
webRoot = path.resolve(__dirname, '../');


server.listen(config.port)

console.log('\t :: Express :: Listening on port ' + config.port);

app.get( '/', function( req, res ){
    console.log('trying to load %s', webRoot + '/index.html');
    res.sendFile( '/index.html' , { root: webRoot});
});

app.get( '/*' , function( req, res, next ) {

        //This is the current file they have requested
    var file = req.params[0];

        //For debugging, we can track what files are requested.
    if(verbose) console.log('\t :: Express :: file requested : ' + file);

        //Send the requesting client the file.
    res.sendFile( webRoot + '/' + file );

});

var sio = io.listen(server);

//create server physics
gameCore = new game_core();

sio.sockets.on('connection', function (client) {
    
    client.userid = UUID();
    gameCore.addPlayer(client.userid);

    client.emit('onconnected', { id: client.userid } );

    console.log('\t socket.io:: player ' + client.userid + ' connected');

    // game_server.findGame(client);

    client.on('message', function(player) {
        //should only store the updates here
        gameCore.players[client.userid].update(player.keys);
        //console.log(player.keys);      
         // console.log(client.userid, player.position.x, player.position.y);
        //game_server.onMessage(client, m);
        // console.log(players_pos);

    });

    client.on('disconnect', function () {
        console.log("disconnect");
        delete gameCore.players[client.userid];
        //Useful to know when someone disconnects
        console.log('\t socket.io:: client disconnected ' + client.userid);
    });
 
});

//Server Physics Loop
setInterval(function() {
    //should process the stored inputs here
    gameCore.physicsStep();
}, 15);

//Server Update Loop
setInterval(function() {
    //construct message that will be returned to client
    var updateMessage = {};
    for (var key in gameCore.players) {
        // Change
        updateMessage[key] = {x: gameCore.players[key].body.position[0], y: gameCore.players[key].body.position[1], angle: gameCore.players[key].body.angle};
    }    
    sio.sockets.emit("onserverupdate", updateMessage);
}, 45);

