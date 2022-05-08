var cors = require('cors')

var whiteList = [
    'http://localhost:3000', 
    'https://localhost:3443', 
    'https://localhost:8080', 
    'http://localhost:8080', 
    'https://192.168.1.6:8080', 
    'http://192.168.1.6:8080',
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002', 
    'http://localhost:3003', 
    'https://localhost:3000', 
    'https://localhost:3001', 
    'https://localhost:3002', 
    'https://localhost:3003', 
    'https://lego-data.guazi-cloud.com',
    'http://pangu.guazi-cloud.com:3000',
    'https://pangu.guazi-cloud.com:3000',
]
var corsOptionDelegate = (req, cb) => {
  var corsOptions
  console.log('origin', req.header('Origin'))
  if (whiteList.indexOf(req.header('Origin')) !== -1) {
      console.log(true)
      corsOptions = {
          origin: true,
          optionsSuccessStatus: 200,
          credentials: true,
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          preflightContinue: false,
          allowdHeaders: ['Content-Type', 'Authorization'],
          exposedHeaders: ['Content-Type', 'X-Content-Range']
        }
    } else {
      console.log(false)
    corsOptions = {origin: false}
  }
  cb(null, corsOptions)
}

module.exports = {
  cors: cors(),
  corsWithOptions: cors(corsOptionDelegate)
}