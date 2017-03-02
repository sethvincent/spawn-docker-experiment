var path = require('path')
var dockerode = require('dockerode')
var spawnDocker = require('./index')

var docker = dockerode()

var imageName = process.argv[2]
var containerPath = path.join(__dirname, 'containers', 'browserify')
var files = ['Dockerfile', 'init.sh', 'index.js', 'empty.js']

var code = `"console.log('heyo')"`

buildImage(imageName, containerPath, files, function () {
  spawn('.', ['/usr/src/app/init.sh', code], imageName, function () {
    console.log('end')
  })
})

function buildImage (imageName, containerPath, files, callback) {
  docker.buildImage({
    context: containerPath,
    src: files
  }, { t: imageName }, function (err, stream) {
    stream.pipe(process.stdout)
    stream.on('end', callback)
  })
}

function spawn (cmd, args, imageName, callback) {
  var child = spawnDocker(cmd, args, { image: imageName })
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  child.stdout.on('end', callback)
}
