'use strict';

var
    io = require('socket.io'),
    express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    GameServer = require('./game_server.js'),
    server = http.createServer(app),

    config = require('./config.json'),
    verbose = false,
    webRoot;

// resolve the path to the web root
webRoot = path.resolve(__dirname, '../');


server.listen(config.port);

console.log('\t :: Express :: Listening on port ' + config.port);

app.get('/', function (req, res) {
    console.log('trying to load %s', webRoot + '/index.html');
    res.sendFile('/index.html', { root: webRoot });
});

app.get('/*', function (req, res, next) {
    var file = req.params[0];
    if (verbose) console.log('\t :: Express :: file requested : ' + file);
    res.sendFile(webRoot + '/' + file);
});

var sio = io.listen(server);

var gameServer = new GameServer(sio);

gameServer.init();

// //create server physics
// gameCore = new GameCore();

// var newBullets = [];

// sio.sockets.on('connection', function (client) {
    
//     client.userid = UUID();
//     gameCore.addPlayer(client.userid);

//     client.emit('onconnected', { id: client.userid } );

//     console.log('\t socket.io:: player ' + client.userid + ' connected');

//     // game_server.findGame(client);

//     client.on('message', function(message) {
//         //should only store the updates here
//         gameCore.players[client.userid].update(message.keys);
//         //New bullet was shoot
//         if (message.keys.Key_SPACEBAR) {
//             console.log("Got Bullet message!");
//             gameCore.addBullet(client.userid);
//             console.log("Finished adding bullet!");
//             newBullets.push(client.userid);
//         }
//         //console.log(player.keys);      
//          // console.log(client.userid, player.position.x, player.position.y);
//         //game_server.onMessage(client, m);
//         // console.log(players_pos);

//     });

//     client.on('disconnect', function () {
//         console.log("Player Disconnected");
//         delete gameCore.players[client.userid];
//         //Useful to know when someone disconnects
//         console.log('\t socket.io:: client disconnected ' + client.userid);
//     });
 
// });

// //Server Physics Loop
// setInterval(function() {
//     //should process the stored inputs here
//     gameCore.physicsStep();
// }, 15);

// //Server Update Loop
// setInterval(function() {
//     //construct message that will be returned to client
//     var playerDataToSend = {};
//     for (var key in gameCore.players) {
//         // Change
//         playerDataToSend[key] = {x: gameCore.players[key].body.position[0], y: gameCore.players[key].body.position[1], angle: gameCore.players[key].body.angle};
//     }

//     var updateMessage = {
//         player : playerDataToSend,
//         bullet : newBullets
//     };

//     // newBullets.length = 0;
//     // for (var key in newBullets) {
//     //     updateMessage.bullet[key]
//     // }
//     // console.log(updateMessage);
//     sio.sockets.emit("onserverupdate", updateMessage);

//     //clear newBulletsArray
//     newBullets.length = 0;
// }, 45);

