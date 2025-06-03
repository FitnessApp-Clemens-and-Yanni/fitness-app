#!/bin/sh

cd server
npm i
./update_shared.sh
npm run build
cd ../

cd mobile
npm i
./update_shared.sh
cd ../
