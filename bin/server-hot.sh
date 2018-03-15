#!/bin/bash

# wait until Webpack ready
while [ ! -f ./dist/server.bundle.js ]
do
  sleep 2
done

# run Node in watch mode
yarn run server:dev:node
