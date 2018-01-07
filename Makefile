all: readme

readme:
	markedpp --githubid -i README.md -o README.md

loadbalance:
	node src/backend.js --port 3000 &
	node src/backend.js --port 3001 &
	node src/backend.js --port 3002 &
	haproxy -f conf/loadbalance.cfg &
	node src/client.js
	make stop

throttle:
	node src/backend.js &
	haproxy -f conf/throttle.cfg &
	node src/client.js --count 1000
	make stop

# kill any running servers
stop:
	ps | egrep "haproxy|node" | awk '{print $$1}' | xargs kill -9

.PHONY:
	readme loadbalance throttle stop
