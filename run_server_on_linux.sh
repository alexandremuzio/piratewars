#!/bin/bash

browserify main.js > bundle.js
nodejs server/game_server.js