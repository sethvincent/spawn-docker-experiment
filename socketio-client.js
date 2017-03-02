var io = require('socket.io-client')('http://127.0.0.1:3452')

io.on('connect', function (a, b, c) {
  console.log(a, b, c)
})

io.on('build:complete', function (result) {
  console.log('result', result)
})

var button = document.createElement('button')
button.innerText = 'build'
document.body.appendChild(button)

button.addEventListener('click', function (e) {
  io.emit('build', { code: 'console.log("weeeoeoeoeoeoeoeoeoeoeoeoeoeoeoeoeoeoeoeooeeoeo")' })
})
