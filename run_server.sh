#!/bin/bash

browserify main.js > bundle.js
node server/game_server.js
