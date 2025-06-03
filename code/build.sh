#!/bin/sh

cd server
npm install
./update_shared.sh
npm run build
cd ../

cd mobile
npm install
./update_shared.sh
cd ../
