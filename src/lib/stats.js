'use strict'

/**
 * Statistics
 */
function Stats (timeout, port) {
  Object.assign(this, {
    data: {},
    _port: port || '',
    _time: 0,
    _count: 0,
    values: { _sum: 0 },
    timeout: timeout || 1000
  })

  process.on('SIGINT', function () {
    this.stop()
    setTimeout(function () {
      process.exit(0)
    }, 20)
  }.bind(this))
}
Stats.prototype = {
  count: function (val) {
    if (val) {
      if (!this.values[val]) {
        this.values[val] = 0
      }
      this.values[val]++
    }
    this.values._sum++
  },

  timer: function () {
    var diff = +Date.now() - this._start

    // count up values
    for (var val in this.values) {
      if (!this.data[val]) {
        this.data[val] = 0
      }
      this.data[val] += this.values[val]
    }
    this._time += diff
    this._count++

    this.log(diff, this.values)

    this.values = { _sum: 0 }
    this._start = +Date.now()
  },

  log: function (diff, values, count) {
    var out = []
    Object.keys(values).sort().forEach(function (val) {
      var v = values[val]
      if (count) {
        v = (v / count).toPrecision(3)
      }
      out.push(val + ':' + v)
    })

    console.log(this._port + '   ' + diff + ' ms', out.join('\t'))
  },

  start: function () {
    this._start = +Date.now()
    this._timerId = setInterval(this.timer.bind(this), this.timeout)
  },

  stop: function () {
    console.log()
    this.log(this._time, this.data, this._count)
    clearInterval(this._timerId)
  }
}

module.exports = Stats
