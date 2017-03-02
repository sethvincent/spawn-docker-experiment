var EventEmitter = require('events').EventEmitter
var dockerode = require('dockerode')
var through = require('through2')

module.exports = function spawnDocker (command, args, options) {
  var image = options.image
  var docker = dockerode()

  var child = new EventEmitter()
  child.stdout = through()
  child.stderr = through()

  var command = [command].concat(args).join(' ')
  var cmd = ['bash', '-c'].concat([command])

  docker.run(image, cmd, [child.stdout, child.stderr], {Tty:false}, function (err, data, container) {
    if (err) return child.emit('error', err)
    child.emit('data', data, container)
    child.emit('end')
  })

  return child
}
