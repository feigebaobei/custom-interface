var express = require('express');
var cors = require('./cors')
var router = express.Router();
let bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path')
// const hash = require('object-hash');
const { instance } = require('../utils');

router.use(bodyParser.json())

// let clog = console.log
const pathJsonPath = path.resolve(__dirname, './path.json')

let readFileSyncPathJson = () => {
  let pathJson = fs.readFileSync(pathJsonPath, {
    encoding: 'utf8'
  })
  pathJson = JSON.parse(pathJson)
  return pathJson
}

router.route('/')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res) => {
  // console.log('req', req)
  instance({
    url: 'https://dict.youdao.com/suggest',
    method: 'get',
    // params: {
    //   num: '5',
    //   ver: '3.0',
    //   doctype: 'json',
    //   cache: 'false',
    //   le: 'en',
    //   q: req.query.q || ''
    // }
    params: req.query || {}
  }).then(dataFromYD => {
    if (dataFromYD.result.code === 200) {
      res.status(200).json({
        code: 0,
        message: "ok",
        data: dataFromYD.data.entries
      })
    } else {
      res.status(200).json({
        code: 1,
        message: dataFromYD.result.message,
        data: ''
      })
    }
  }).catch((error) => {
    res.status(200).json({
      code: 1,
      message: '参数类型错误',
      error
    })
  })
})
.post(cors.corsWithOptions, (req, res) => {
  res.status(200).json({
    code: 0,
    message: "ok",
    data: {},
  })
})
.put(cors.corsWithOptions, (req, res) => {
  res.send('put')
})
.delete(cors.corsWithOptions, (req, res) => {
  res.send('delete')
})

module.exports = router;
