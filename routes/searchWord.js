var express = require('express');
var cors = require('./cors')
var router = express.Router();
let bodyParser = require('body-parser');
// const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const FormData = require('form-data')
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
        wordJson.unshift({entry, explain})
        fsPromises.writeFile(searchWordHistoryJson, JSON.stringify(wordJson))
    })
}

router.route('/')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res) => {
  let transP = instance({
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
  })
  // }).then(dataFromYD => {
    // if (dataFromYD.result.code === 200) {}
  // })

  // q: apple
  // le: en
  // t: 2
  // client: web
  // sign: 1dde9b3462e35d76b630728d502a8db6
  // keyfrom: webdict
  let formData = new FormData()
  formData.append('q', req.query.q)
  formData.append('le', 'en')
  formData.append('t', '2')
  formData.append('client', 'web')
  formData.append('sign', '1dde9b3462e35d76b630728d502a8db6')
  formData.append('keyfrom', 'webdict')
  let symbolP = instance({
    url: 'https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4',
    method: 'post',
    data: formData
  })

  Promise.all([transP, symbolP]).then(([trans, symbol]) => {
    // console.log('trans, symbol', symbol.simple)
    let entries = trans.data.entries
    entries[0].ukphone = symbol.simple.word[0].ukphone
    entries[0].usphone = symbol.simple.word[0].usphone
    entries[0].query = symbol.simple.query
    res.status(200).json({
      code: 0,
      message: '',
      data: entries
    })
  }).catch(error => {
    res.status(200).json({
      code: 1,
      message: '错误',
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
