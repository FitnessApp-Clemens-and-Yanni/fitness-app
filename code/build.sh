#!/bin/sh

cd shared
npm install
cd ../

cd server
npm install
npm run build
cd ../

cd mobile
npm install
cd ../
