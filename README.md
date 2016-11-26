# HAProxy Examples

> A collection of HAProxy examples

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Prerequisites](#prerequisites)
* [Examples](#examples)
  * [Loadbalancer](#loadbalancer)
  * [Limit Connections and SessionRate](#limit-connections-and-sessionrate)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Prerequisites

- HAProxy >=1.5.14
- node.js >=0.12

## Examples

### Loadbalancer

Source: [conf/loadbalance.cfg](conf/loadbalance.cfg)

The configuration sets up a HTTP loadbalancer with 3 configured backend servers, one of them in active standby

Run `make loadbalance` and access http://localhost:8888


### Limit Connections and SessionRate

Source: [conf/throttle.cfg](conf/throttle.cfg)

If it is desired to protect a backend with a dedicated session and connection rate use this recipe.

`throttle.conf` limits all incomming connections to only 5 concurrent requests being received at the backend. All other requests are immediately blocked with a 403 HTTP Response.

Run `make throttle` and access http://localhost:8888

## License

Copyright (c) 2016 commenthol (MIT License)

See [LICENSE][] for more info.

## References

<!-- !ref -->

* [HAProxy][HAProxy]
* [LICENSE][LICENSE]

<!-- ref! -->

[LICENSE]: ./LICENSE
[HAProxy]: http://www.haproxy.org/
