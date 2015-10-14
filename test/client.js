'use strict'

/* global describe, it */

var assert = require('assert')
var client = require('../src/client')
var server = require('../src/backend').server

describe('httpReq', function () {

  before(function () {
    server(3000).listen(3000)
  })

  it('can call a backend', function (done) {
    client.httpReq(null, function (err, status) {
      assert.equal(status, 200)
      done()
    })
  })

  it('can run three connections in parallel', function (done) {
    var runner = client.runner()

    client.parallel({ count: 3 }, runner.run, function () {
      // ~ console.log(runner.stats.values)
      assert.equal(runner.stats.values['200'], 3)
      done()
    });
  })

})