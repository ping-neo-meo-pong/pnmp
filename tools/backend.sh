#!/bin/bash

if [ ! -d "node_modules" ];then
  rm -f package-lock.json
  npm install
fi

exec npm run start