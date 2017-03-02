var browserify = require('browserify')
var through = require('through2')

var str = process.argv[2]

var b = browserify()
  .add('empty.js')
  .transform(function (file) {
    return through(function () {}, function () {
      this.push(str)
      this.push(null)
    })
  })

b.bundle(function (err, res) {
  console.log(res.toString())
})
