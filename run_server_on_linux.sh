#!/bin/bash

browserify main.js -o bundle.js
nodejs server/game_server.js