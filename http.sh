#!/bin/bash

. ./common

x-terminal-emulator -e "node server.js 3000"
x-terminal-emulator -e "node server.js 3001"
run http.cfg
killall node
