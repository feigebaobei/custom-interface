var express = require('express');
var cors = require('./cors')
var router = express.Router();
let bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path')

router.use(bodyParser.json())

let clog = console.log

router.route('/')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res) => {
  res.status(200).json({
    code: 0,
    message: "ok",
    data: {},
  })
})
.post(cors.corsWithOptions, (req, res) => {
  // clog(req)
  // req.body = {
  //   path: string,
  //   method: string,
  //   data: any
  // }
  if (typeof(req.body.path) === 'string' && typeof(req.body.method) === 'string' && typeof(req.body.data) === 'object') {
    let pathJsonPath = path.resolve(__dirname, './path.json')
    let pathJson = fs.readFileSync(pathJsonPath, {
      encoding: 'utf8'
    })
    pathJson = JSON.parse(pathJson)
    let curObj = {
      [`${req.body.path}`]: {
        [`${req.body.method}`]: req.body.data
      }
    }
    Object.assign(pathJson, curObj)
    fs.writeFileSync(pathJsonPath, JSON.stringify(pathJson))

    res.status(200).json({
      code: 0,
      message: "ok",
      data: JSON.stringify(pathJson),
    })
  } else {
    res.status(200).json({
      code: 1,
      message: '参数类型错误',
      data: {},
    })

  }
})
.put(cors.corsWithOptions, (req, res) => {
  res.send('put')
})
.delete(cors.corsWithOptions, (req, res) => {
  res.send('delete')
})

module.exports = router;
