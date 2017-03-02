var req = require('request')

req({
  url: 'http://127.0.0.1:3452',
  body: `console.log('doug')`,
  method: 'POST'
}, function (err, res, body) {
  console.log(body)
})
