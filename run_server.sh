#!/bin/bash

browserify main.js > bundle.js
node game_server.js
