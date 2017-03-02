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
  send({message: 'hi'}).pipe(res)
})

var server = http.createServer(app)
var io = require('socket.io')(server)

io.on('connection', function (client) {
  client.on('build', function (data) {
    buildImage(imageName, containerPath, files, function () {
      spawn('node', ['/usr/src/app/index.js', `"${data.code}"`], imageName, function (result) {
        client.emit('build:complete', result)
      })
    })
  })

  client.on('disconnect', function () {
    console.log('client disconnected')
  })
})

server.listen(3452, function () {
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
