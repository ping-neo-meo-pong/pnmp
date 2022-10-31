#!/bin/bash

if [ ! -d "node_modules" ];then
  npm install
  npm install @nestjs/cli 
fi

exec npm run start