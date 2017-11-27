var test = require('tape')
var execspawn = require('npm-execspawn')
var mininet = require('./lib/mininet')

function setup (cb) {
  buildImage(function (err) {
    if (err) fatal(err)
    console.log('starting mininet')
    mininet.start(function (err, nodes) {
      if (err) fatal(err)
      console.log('mininet started')
      cb(nodes)
    })
  })
}

function tests (nodes, cb) {
  test.onFinish(teardown(cb))

  test('local network, 2 nodes, dat share and dat clone, mdns', function (t) {
    console.log('nodes', nodes)
    console.log('waiting 3 seconds')
    setTimeout(function () {
      t.ok(true, 'Bogus test')
      t.end()
    }, 3000)
  })
}

function teardown (cb) {
  return function () {
    console.log('stopping mininet')
    mininet.stop(function (err) {
      if (err) fatal(err)
      console.log('mininet stopped')
      cb()
    })
  }
}

function buildImage (cb) {
  var mc = execspawn('mkcontainer')
  mc.stderr.pipe(process.stderr)
  mc.stdout.pipe(process.stdout)
  mc.on('close', function (code) {
    if (code) return cb(new Error('mkcontainer failed'))
    cb()
  })
}

function fatal (err) {
  console.error('Fatal error', err)
  process.exit(1)
}

setup(function (nodes) {
  tests(nodes, function () {
    console.log('Done.')
  })
})
