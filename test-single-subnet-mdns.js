var test = require('tape')
// var cp = require('child_process')
var execspawn = require('npm-execspawn')
// var spawn = require('tape-spawn')

test('local network, 2 nodes, dat share and dat clone, mdns', function (t) {
  buildImage(function (err) {
    t.error(err)
    t.end()
  })
})

function buildImage (cb) {
  var mc = execspawn('mkcontainer')
  mc.stderr.pipe(process.stderr)
  mc.stdout.pipe(process.stdout)
  mc.on('close', function (code) {
    if (code) return cb(new Error('mkcontainer failed'))
    cb()
  })
}
