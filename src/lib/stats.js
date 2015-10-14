'use strict'

/**
 * Statistics
 */
var stats = function (timeout) {
  var self = {
    data: {},
    _time: 0,
    _count: 0,
    values: {
      _sum: 0
    },
    timeout: timeout || 1000
  }

  self.count = function (val) {
    if (val) {
      if (!self.values[val]) {
        self.values[val] = 0
      }
      self.values[val]++
    }
    self.values._sum++
  }

  self.timer = function () {
    var diff = +Date.now() - self._start

    // count up values
    for (var val in self.values) {
      if (!self.data[val]) {
        self.data[val] = 0
      }
      self.data[val] += self.values[val]
    }
    self._time += diff
    self._count++

    self.log(diff, self.values)

    self.values = { _sum: 0 }
    self._start = +Date.now()
  }

  self.log = function (diff, values, count) {
    var out = []
    Object.keys(values).sort().forEach(function (val) {
      var v = values[val]
      if (count) {
        v = (v / count).toPrecision(3)
      }
      out.push(val + ':' + v)
    })

    console.log(diff + ' ms', out.join('\t'))
  }

  self.start = function () {
    self._start = +Date.now()
    self._timerId = setInterval(self.timer, self.timeout)
  }

  self.stop = function () {
    console.log()
    self.log(self._time, self.data, self._count)
    clearInterval(self._timerId)
  }

  process.on('SIGINT', function () {
    self.stop()
    setTimeout(function () {
      process.exit(0)
    }, 20)
  })

  return self
}

module.exports = stats
