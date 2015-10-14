# HAProxy Examples

> A collection of HAProxy examples

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Prerequisites](#prerequisites)
* [Examples](#examples)
  * [Limit Connections and SessionRate](#limit-connections-and-sessionrate)
* [References](#references)

<!-- toc! -->

## Prerequisites

- HAProxy 1.5.14
- node.js >=0.12
- curl

## Examples

### Limit Connections and SessionRate

Source: [src/throttle.conf](src/throttle.conf)

If it is desired to protect a backend with a dedicated session and connection rate use this recipe.

````sh
# start a backend server
node src/backend.js

# in another terminal
# start haproxy only allowing 5 concurrent requests
haproxy -f src/throttle.conf

# in another terminal
# start parallel connections
node src/client.js
````

`throttle.conf` limits all incomming connections to only 5 concurrent requests being received at the backend. All other requests are immediately blocked with a 403 HTTP Response.

## References

<!-- !ref -->

* [HAProxy][HAProxy]

<!-- ref! -->

[HAProxy]: http://www.haproxy.org/
