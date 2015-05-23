var
    gameport        = process.env.PORT || 3000,

    io              = require('socket.io'),
    express         = require('express'),
    UUID            = require('node-uuid'),

    verbose         = false,
    http            = require('http'),
    app             = express(),
    server          = http.createServer(app);

/* Express server set up. */

//The express server handles passing our content to the browser,
//As well as routing users where they need to go. This example is bare bones
//and will serve any file the user requests from the root of your web server (where you launch the script from)
//so keep this in mind - this is not a production script but a development teaching tool.

    //Tell the server to listen for incoming connections
server.listen(gameport)

    //Log something so we know that it succeeded.
console.log('\t :: Express :: Listening on port ' + gameport );

    //By default, we forward the / path to index.html automatically.
app.get( '/', function( req, res ){
    console.log('trying to load %s', __dirname + '/index.html');
    res.sendFile( '/index.html' , { root:__dirname });
});


    //This handler will listen for requests on /*, any file from the root of our server.
    //See expressjs documentation for more info on routing.

app.get( '/*' , function( req, res, next ) {

        //This is the current file they have requested
    var file = req.params[0];

        //For debugging, we can track what files are requested.
    if(verbose) console.log('\t :: Express :: file requested : ' + file);

        //Send the requesting client the file.
    res.sendFile( __dirname + '/' + file );

}); //app.get *


/* Socket.IO server set up. */

//Express and socket.io can work together to serve the socket.io client files for you.
//This way, when the client requests '/socket.io/' files, socket.io determines what the client needs.
    
    //Create a socket.io instance using our express server
var sio = io.listen(server);

    //Enter the game server code. The game server handles
    //client connections looking for a game, creating games,
    //leaving games, joining games and ending games when they leave.
    // game_server = require('./game.server.js');

    //Socket.io will call this function when a client connects,
    //So we can send that client looking for a game to play,
    //as well as give that client a unique ID to use so we can
    //maintain the list if players.


var players_pos = {};



setInterval(function() {
    console.log(players_pos);
    sio.sockets.emit("onserverupdate", players_pos);
}, 1);

sio.sockets.on('connection', function (client) {
    
    //Generate a new UUID, looks something like
    //5b2ca132-64bd-4513-99da-90e838ca47d1
    //and store this on their socket/connection
    client.userid = UUID();

    //tell the player they connected, giving them their id
    client.emit('onconnected', { id: client.userid } );

    //Useful to know when someone connects
    console.log('\t socket.io:: player ' + client.userid + ' connected');

        //now we can find them a game to play with someone.
        //if no game exists with someone waiting, they create one and wait.
    // game_server.findGame(client);

    //     //Now we want to handle some of the messages that clients will send.
    //     //They send messages here, and we send them to the game_server to handle.
    client.on('message', function(player) {
        players_pos[client.userid] = {x: player.position.x, y : player.position.y};        
         console.log(client.userid, player.position.x, player.position.y);
        //game_server.onMessage(client, m);
        // console.log(players_pos);

    }); //client.on message

        //When this client disconnects, we want to tell the game server
        //about that as well, so it can remove them from the game they are
        //in, and make sure the other player knows that they left and so on.
    client.on('disconnect', function () {
        delete players_pos[client.userid];
        //Useful to know when soomeone disconnects
        console.log('\t socket.io:: client disconnected ' + client.userid);

    }); //client.on disconnect
 
}); //sio.sockets.on connection