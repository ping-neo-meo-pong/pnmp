#!/bin/bash

if [ ! -d "node_modules" ];then
  npm install
fi

npm install @nestjs/cli 
exec npm run start