var fs = require('fs')
var cp = require('child_process')
var pty = require('node-pty')

exports.start = start
exports.stop = stop

var mn

function start (cb) {
  var callbackUsed = false
  mn = cp.spawn('sudo', [ 'mn' ])
  mn.stderr.pipe(process.stderr)
  mn.stdout.pipe(process.stdout)
  mn.on('close', function (code) {
    if (code) {
      console.error(`mn exited with code ${code}`)
      if (!callbackUsed) {
        callbackUsed = true
        cb(new Error('mn existed with non-zero code'))
      }
    }
  })
  mn.stderr.on('data', function (data) {
    var line = data.toString()
    if (line.match(/Starting CLI/)) {
      if (!callbackUsed) {
        var nodes = getNodes()
        callbackUsed = true
        cb(null, nodes)
      }
    }
  })
}

function stop (cb) {
  mn.on('close', function (code, signal) {
    console.log(`mn terminated due to signal ${signal}`)
    cb()
  })
  // Allocate another pty because sudo will refuse to
  // send signals to subprocess otherwise
  var bash = pty.spawn('bash')
  bash.write(`sudo kill ${mn.pid}\r`)
  bash.write(`exit\r`)
}

function getNodes () {
  var procFiles = fs.readdirSync('/proc')
  var nodes = procFiles.reduce(function (acc, procFile) {
    var pid = Number.parseInt(procFile, 10)
    if (!pid) return acc
    var content = fs.readFileSync('/proc/' + procFile + '/cmdline', 'utf8')
    var regex = /^bash\u0000--norc\u0000-is\u0000mininet:(.*)\u0000$/
    var match = content.match(regex)
    if (match) {
      var nodeName = match[1]
      acc[nodeName] = pid
    }
    return acc
  }, {})
  return nodes
}
