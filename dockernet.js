#!/usr/bin/env node

const {exec} = require('child_process')

const [name, ipd] = process.argv.slice(2)

network(name, (err, gateway) => {
  if (err) {
    console.error(err.message)
    process.exit(1)
  } else if (!ipd) {
    console.log(gateway)
  } else {
    const ip = gateway.split(/\./)
    ip[3] = ipd
    console.log(ip.join('.'))
  }
})

function network (name, cb) {
  exec(`docker network inspect ${name}`, (err, stdout) => {
    let gateway
    if (!err && stdout) {
      try {
        const o = JSON.parse(stdout)
        gateway = o[0].IPAM.Config[0].Gateway
      } catch (e) {
        err = e
      }
    }
    cb(err, gateway)
  })
}
