var path = require('path')
var http = require('http')

var spawnDocker = require('./index')
var docker = require('dockerode')()
var app = require('appa')()
var send = require('appa/send')

var imageName = 'browserify'
var containerPath = path.join(__dirname, 'containers', 'browserify')
var files = ['Dockerfile', 'init.sh', 'index.js', 'empty.js']

app.on('/', { parseJSON: false }, function (req, res, ctx) {
  if (req.method === 'POST') {
    buildImage(imageName, containerPath, files, function () {
      var child = spawn('node', ['/usr/src/app/index.js', `"${ctx.body}"`], imageName, function (result) {
        return send({ message: result }).pipe(res)
      })
    })
  }
})

http.createServer(app).listen(3452, function () {
  console.log('started on 127.0.0.1:3452')
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
  var result = ''

  child.stdout.on('data', function (data) {
    result += data.toString()
  })

  child.stdout.on('end', function () {
    callback(result)
  })

  return child
}
