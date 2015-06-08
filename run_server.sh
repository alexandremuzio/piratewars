#!/bin/bash

browserify client/client.js > bundle.js
node server/app.js
