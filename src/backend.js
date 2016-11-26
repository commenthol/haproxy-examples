#!/usr/bin/env node

'use strict'

var http = require('http')
var url = require('url')
var Stats = require('./lib/stats')
var cli = require('./lib/cli')

/**
 * starts a HTTP Server
 */
function startServer (options) {
  var stats

  if (typeof options === 'number') {
    options = { port: options }
  }

  options = Object.assign({
    port: 3000,
    stats: true,
    log: false,
    delay: 0
  }, options)

  if (options.stats) {
    stats = new Stats(1000, options.port)
    stats.start()
  }

  var server = http.createServer(function (req, res) {
    var status
    var query = url.parse(req.url, true).query || {}

    if (options.stats) {
      stats.count()
    }
    if (options.log) {
      console.log(req.url, req.headers, query)
    }

    if (/^\/ping$/.test(req.url)) {
      res.statusCode = 200
      res.end('pong')
      return
    } else if (/^\/\d{3}/.test(req.url)) {
      status = req.url.replace(/\/(\d{3})/, '$1')
      status = parseInt(status, 10)
      switch (status) {
        case 301:
        case 302:
        case 303: {
          res.statusCode = status
          res.setHeader('Location', (query.location || '/'))
          break
        }
        case 400:
        case 401:
        case 402:
        case 403:
        case 404: {
          res.statusCode = status
          break
        }
        default: {
          res.statusCode = 500
          break
        }
      }
      res.end()
      return
    }

    if (options.delay) {
      setTimeout(function () {
        res.end(options.port + ':' + req.url + ' ' + req.method + ' ' + options.delay + '\n')
      }, options.delay)
    } else {
      res.end(options.port + ':' + req.url + ' ' + req.method + '\n')
    }
  })

  return server
}

exports.server = startServer

/**
 * backend.js [--port <number>] [--delay <time in ms>]
 */
if (require.main === module) {
  var opts = Object.assign({ port: 3000, delay: 0 }, cli())
  startServer(opts).listen(opts.port)
}
