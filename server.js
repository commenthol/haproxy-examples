#!/usr/bin/env node

const http = require('http')
const {format} = require('util')

const args = process.argv.slice(2)
const port = args[0] || 3000

const log = (req) => {
  const {method, url, headers} = req
  str = format(':%s %s %s %s %s\n  %s',
    port, method, url,
    req.socket.remoteAddress,
    Math.random().toString(16).substr(2),
    JSON.stringify(headers, null, 2).replace(/\n/g, '\n  ')
  )
  return str
}

const server = http.createServer((req, res) => {
  const {url} = req

  let str = log(req)
  console.log(str)

  if (req.url === '/ping') {
    str = 'pong'
  }
  res.end(str + '\n')
})

server.listen(port, () => {
  console.log('running on :%s', port)
})
