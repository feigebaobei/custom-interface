var express = require('express');
var cors = require('./cors')
var router = express.Router();
let bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path')
const hash = require('object-hash');


router.use(bodyParser.json())

let clog = console.log
const pathJsonPath = path.resolve(__dirname, './path.json')

let readFileSyncPathJson = () => {
  let pathJson = fs.readFileSync(pathJsonPath, {
    encoding: 'utf8'
  })
  pathJson = JSON.parse(pathJson)
  return pathJson
}

router.route('/setInterface')
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
  // req.body = {
  //   path: string,
  //   method: string,
  //   queryOrBody: string,
  //   data: any
  // }
  if (typeof(req.body.path) === 'string' && typeof(req.body.method) === 'string' && typeof(req.body.data) === 'object') {
    let pathJson = readFileSyncPathJson()
    let objKey = {
      path: req.body.path,
      method: req.body.method,
      queryOrBody: req.body.queryOrBody
    }
    objKey = hash(objKey, { algorithm: 'md5' });
    Object.assign(pathJson, {
      [`${objKey}`]: req.body.data
    })
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

router.route('/*')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res) => {
  // req.url string
  // req.params object
  // req.method string
  // req.query object
  // req.body object
  let pathJson = readFileSyncPathJson()
  let objKey = {
    path: Object.values(req.params).join('/'),
    method: 'get',
    queryOrBody: Object.entries(req.query).reduce((r, [k, v]) => {
      r += `&${k}=${v}`
      return r
    }, '').slice(1)
  }
  objKey = hash(objKey, {algorithm: 'md5'})
  let data = pathJson[objKey]
  res.status(200).json({
    code: 0,
    message: '',
    data,
  })
})
.post(cors.corsWithOptions, (req, res) => {
  let pathJson = readFileSyncPathJson()
  let objKey = {
    path: Object.values(req.params).join('/'),
    method: 'post', // req.method.toLowerCase()
    queryOrBody: req.body
  }
  objKey = hash(objKey, {algorithm: 'md5'})
  res.status(200).json({
    code: 0,
    message: '',
    data: pathJson[objKey],
  })
})
.put(cors.corsWithOptions, (req, res) => {
  res.send('put')
})
.delete(cors.corsWithOptions, (req, res) => {
  res.send('delete')
})


module.exports = router;
