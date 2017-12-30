FROM haproxy:1.8-alpine

COPY start.sh /usr/bin

CMD [start.sh]
