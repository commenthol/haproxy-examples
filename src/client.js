#!/usr/bin/env node

'use strict'

var http = require('http')
var extend = require('util')._extend
var stats = require('./lib/stats')
var cli = require('./lib/cli')

/**
 * run function `fn` in parallel
 *
 * @param {Object} options -
 * @param {Number} options.count - number of parallel executions of `fn` - defaults to 1
 * @param {Function} fn - function run call `count`-times in parallel
 * @param {Function} callback - if undefined then loop runs endlessly
 */
function parallel(options, fn, callback) {
  options = extend({ count: 1 }, options)

  var i = options.count

  function cb(err, res) {
    if (callback) {
      i--
      if (i === 0) {
        callback()
      }
    } else {
      // run endlessly until SIGINT
      run()
    }
  }

  function run() {
    try {
      fn(function (err, res) {
        process.nextTick(function () {
          cb(err, res)
        })
      })
    } catch(e) {
      cb(e)
    }
  }

  ;(function () {
    var limit = options.count
    while (limit > 0) {
      limit--
      run()
    }
  })();
}

/**
 * http request function
 *
 * @param {Object} options - http options
 * @param {Function} callback - `function (err, statusCode)`
 */
function httpReq(options, callback) {
  options = extend({
    host: 'localhost',
    port: 8000,
    path: '/'
  }, options)

  http.request(options, function (res) {
    res
      .on('data', function () {})
      .on('end', function () {
        callback(null, res.statusCode)
      })

  })
  .on('error', function (e) {
    callback(e)
  })
  .end()
}

/**
 * runner which wraps the stats of a single HTTP request
 * @param {Object} option - http request option
 * @return {Object} self
 */
function runner(option) {
  var self = {}

  self.stats = stats()
  self.stats.start()

  self.run = function (cb) {
    httpReq(option, function (err, res) {
      if (err) {
        res = err.code || err.message || err
      }
      self.stats.count(res)
      cb()
    })
  }

  return self
}

module.exports = {
  httpReq: httpReq,
  parallel: parallel,
  runner: runner
}

/**
 * client.js [--count <number>] [--port <number>]
 */
if (require.main === module) {
  var opts = extend({ count: 10 }, cli())
  var r = runner(opts)
  parallel(opts, r.run)
}
