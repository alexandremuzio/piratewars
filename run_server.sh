#!/bin/bash

browserify test.js > bundle.js
node server/game_server.js
