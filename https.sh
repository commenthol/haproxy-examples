#!/bin/bash

. ./common

x-terminal-emulator -e "node server.js 3000"
run https.cfg
killall node
