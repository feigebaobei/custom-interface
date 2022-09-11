var express = require('express');
var cors = require('./cors')
var router = express.Router();
let bodyParser = require('body-parser');
// const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const { instance } = require('../utils');

router.use(bodyParser.json())

const searchWordHistoryJson = path.resolve(__dirname, './searchWordHistory.json')


let readHistory = () => {
    return fsPromises.readFile(searchWordHistoryJson, {
        encoding: 'utf-8'
    })
}

let saveHistory = ({entry, explain}) => {
    readHistory().then(wordStr => {
        let wordJson = JSON.parse(wordStr)
        wordJson.push({entry, explain})
        fsPromises.writeFile(searchWordHistoryJson, JSON.stringify(wordJson))
    })
}

router.route('/')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res) => {
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
        saveHistory(dataFromYD.data.entries[0])
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

router.route('/history')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res) => {
    readHistory().then(wordStr => {
        res.status(200).json({
            code: 0,
            message: "ok",
            data: JSON.parse(wordStr)
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
    res.status(200).json({
        code: 0,
        message: "ok",
        data: {},
    })
})
.delete(cors.corsWithOptions, (req, res) => {
//   res.send('delete')
    // req.body {entry: xxx}
    let entry = req.body.entry
    readHistory().then(wordStr => {
        let wordJson = JSON.parse(wordStr)
        wordJson = wordJson.filter(item => {
            return item.entry !== entry
        })
        fsPromises.writeFile(searchWordHistoryJson, JSON.stringify(wordJson))
        res.status(200).json({
            code: 0,
            message: "ok",
            data: ''
        })
    })
})

module.exports = router;