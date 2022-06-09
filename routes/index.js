var express = require('express');
var cors = require('./cors')
var router = express.Router();
let bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path')
const hash = require('object-hash');


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
    }
    switch (req.body.method) {
      case 'get':
      default:
        objKey.queryOrBody = req.body.queryOrBody
        break;
      case 'post':
      case 'put':
      case 'delete':
        objKey.queryOrBody = req.body.queryOrBody ? JSON.parse(req.body.queryOrBody) : {}
        break
    }
    // clog('objKey', objKey)
    objKey = hash(objKey, { algorithm: 'md5' });
    Object.assign(pathJson, {
      [`${objKey}`]: req.body.data
    })
    fs.writeFileSync(pathJsonPath, JSON.stringify(pathJson))
    res.status(200).json({
      code: 0,
      message: "ok",
      data: {}
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


// router.route('/forChange')
// .options(cors.corsWithOptions, (req, res) => {
//   res.sendStatus(200)
// })
// .get(cors.corsWithOptions, (req, res) => {
//   res.status(200).json({
//     code: 0,
//     message: '',
//     data: {
//       two: 'two',
//       four: 'four',
//     }
//   })
// })

router.route('/*')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res) => {
  // url: '/forField?...',
  // method: 'GET',
  // headers: {...}
  // params: { '0': 'forField' },
  // query: {},
  // body: {},
  // cookies: {...}
  let pathJson = readFileSyncPathJson()
  let queryOrBody = Object.entries(req.query).reduce((r, [k, v]) => {
      r += `&${k}=${v}`
      return r
    }, '').slice(1)
  let indexQuestion = req.url.indexOf('?')
  if (indexQuestion < 0) {
    indexQuestion = undefined
  }
  let objKey = {
    path: req.url.slice(0, indexQuestion), // Object.values(req.params).join('/'),
    method: 'get',
    queryOrBody
  }
  // clog('objKey', objKey)
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
    path: req.url,
    method: 'post',
    queryOrBody: req.body
  }
  // clog('objKey', objKey)
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
