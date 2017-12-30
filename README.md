# haproxy

Running the example configurations require the following

- node>=6.0 ; See [node install](https://nodejs.org)
- docker>=17.0 ; See [docker install](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/)
- curl
- ab (Apache HTTP server benchmarking tool)

## Table of Contents

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Table of Contents](#table-of-contents)
- [HTTP Loadbalancer](#http-loadbalancer)
- [SSL-Termination](#ssl-termination)
- [SSL Termination with standby in other zone](#ssl-termination-with-standby-in-other-zone)

<!-- /TOC -->

## HTTP Loadbalancer

- balances to 4 backend servers
- one `:3002` is in active standby
- `:3003` is in disabled standby and may be added manually if required
- two different backends
  - `www` for dynamic content
  - `static` for static content which is configurable via `acl url_static` in `frontend ft_www`

![](./docs/http.svg)

**Related Files**

- `conf/http.cfg`

**Run**

1. `./http.sh`
2. Launch admin page <http://admin:admin@localhost:8888> in browser
2. Open new terminal
3. Get dynamic content with:
   - `curl "http://localhost"`
4. Get static content - header `x-static` should be 1
   - `curl "http://localhost/static"`
   - `curl "http://localhost/test.css"`
5. `ab -n 1000 -c 1000 http://localhost/`

## SSL-Termination

- terminates https connection and server(s)
- redirects all http requests to https
- sets HSTS (Strict-Transport-Security)
- prevents DOS attacks by limiting max. keep-alive time 5s using `option http-server-close`
- limits max. session rate per IP to 10 in a 10s window
- See [Use a load-balancer as a first row of defense against DDOS][]
- **NOTE:** Consider using [`docker secret`][docker secret] to manage your certificates.
  Better reference them under e.g. `/run/secrets/star_chained.crt` from your config.

![](./docs/https.svg)

**Related Files**

- `conf/https.cfg`
- `conf/certs/star_chained.crt` - see [self-signed-certs][]; Wildcard cert for domain `*.aa.aa`

**Run**

1. Add following line to `/etc/hosts`
  ```
  127.0.0.2    one.aa.aa
  ```
2. `./https.sh`
3. Open new terminal
4. `while ((1)); do curl https://one.aa.aa/bb; done`

_Test DDOS_

1. `ab -n 50000000 -c 10 https://one.aa.aa/`
2. run in other term
   ```
   sudo su
   while ((1)) ; do echo "show table ft_ssl" | socat unix:./run/haproxy.stats - ; sleep 1; done
   ```

## SSL Termination with standby in other zone

- starts two HAProxy each in a "separate" zone. For simplicity we do not span over two different networks as this would require additional configuration with iptables.
- terminates https connection and server(s) per zone
- redirects all http requests to https
- if server in zone is unavailable backup server in other zone takes over
- A possible managed DNS provider may balance across zones

![](./docs/https-zones.svg)

**Related Files**

- `conf/zone1.cfg`
- `conf/zone2.cfg`
- `conf/certs/star_chained.crt`; Wildcard cert for domain `*.aa.aa`
- `conf/certs/root_ca.crt`; Root CA Cert for Wildcard cert `star_chained.crt`

**Run**

1. Start `https-zones.sh`.
   This creates a docker network with subnet at `172.100.0/24` and starts the two HAProxies.
2. Add following line to `/etc/hosts`
   ```
   172.100.0.10    zone.aa.aa
   ```
3. Check the admin pages at
   - zone1: <http://172.100.0.10:8888>; svr3000 is Down, zone1 in backup
   - zone2: <http://172.100.0.20:8888>; svr3001 is Active, zone2 in backup
4. Open new terminal
5. `while ((1)); do curl https://zone.aa.aa/bb; done`
6. Start/ Stop server at :3000 with `./server.js 3000`
7. Kill the running containers with `./https-zones.sh kill`

# References

- [HAProxy v1.8 Configuration][]
- [Use a load-balancer as a first row of defense against DDOS][]
- [HTTP request flood mitigation][]
- [self-signed-certs][]
- [docker secret][]

[HAProxy v1.8 Configuration]: http://cbonte.github.io/haproxy-dconv/1.8/configuration.html#
[HTTP request flood mitigation]: https://www.haproxy.com/blog/http-request-flood-mitigation/
[Use a load-balancer as a first row of defense against DDOS]: https://www.haproxy.com/blog/use-a-load-balancer-as-a-first-row-of-defense-against-ddos/
[self-signed-certs]: https://github.com/commenthol/self-signed-certs
[docker secret]: https://docs.docker.com/engine/swarm/secrets
