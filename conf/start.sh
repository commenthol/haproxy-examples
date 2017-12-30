#!/bin/sh -ex
# from https://github.com/dockerfile/haproxy/issues/3
#
# the start script inside the docker container
#
/sbin/syslogd -O /proc/1/fd/1   # <--- link to docker's stdout, not "your stdout"
ifconfig | grep "inet addr"
echo $HOSTNAME
haproxy -f /usr/local/etc/haproxy/haproxy.cfg -db  # <--- stay in foreground
