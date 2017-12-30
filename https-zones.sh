#!/bin/bash

NET=zones

# ----

. ./common

function ips () {
  LOCAL_IP=$(./dockernet.js bridge)
  ZONE1_IP=172.100.0.10
  ZONE2_IP=172.100.0.20
}

function network () {
  local netid=$(docker network ls -f name=$NET -q)
  if [ ! $netid ]; then
    echo "creating docker network $NET"
    docker network create --subnet=172.100.0.0/24 $NET
  fi
  ips
  echo "Local IP is     $LOCAL_IP"
  echo "Zone1 IP is     $ZONE1_IP"
  echo "Zone2 IP is     $ZONE2_IP"
}

function run2 () {
  local name=$1
  local conf=$1.cfg
  docker run \
    --rm \
    --name $name \
    --hostname $name \
    --network=$NET \
    --ip=$2 \
    -t \
    -e LOCAL_IP=$LOCAL_IP \
    -e ZONE1_IP=$ZONE1_IP \
    -e ZONE2_IP=$ZONE2_IP \
    -v $(pwd)/conf/$conf:/usr/local/etc/haproxy/haproxy.cfg \
    -v $(pwd)/conf:/etc/haproxy \
    -v $(pwd)/conf/start.sh:/usr/local/bin/start.sh \
    $IMAGE start.sh
}

function kill () {
  local conf=$1
  docker kill $conf
}

case $1 in
  kill)
    kill zone1
    kill zone2
    killall node
    ;;
  net)
    network
    ;;
  *)
    # x-terminal-emulator -e "node server.js 3000"
    x-terminal-emulator -e "node server.js 3001"
    network
    run2 zone1 $ZONE1_IP &
    run2 zone2 $ZONE2_IP &
    ;;
esac
