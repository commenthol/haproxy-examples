'use strict'

/**
 * simple command line parser
 */
function cli () {
  var args = process.argv.slice(2)
  var options = {}
  var arg, key

  while (args.length) {
    arg = args.shift()
    if ((key = extract(arg))) {
      if (args[0] && !extract(args[0])) {
        options[key] = args.shift()
        if (/^[\d\.]+$/.test(options[key])) {
          options[key] = parseFloat(options[key], 10)
        }
      } else {
        options[key] = true
      }
    }
  }

  return options
}

module.exports = cli

function extract (arg) {
  if ((arg || '').indexOf('--') === 0) {
    return arg.replace(/^--/, '')
  }
}

if (require.main === module) {
  console.log(cli())
}
