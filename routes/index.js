var express = require('express');
var cors = require('./cors')
var router = express.Router();
let bodyParser = require('body-parser');

router.use(bodyParser.json())

let clog = console.log

router.route('/')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, (req, res) => {
  res.status(200).json({
    code: 0,
    message: "",
    data: {},
  })
})
.post(cors.corsWithOptions, (req, res) => {
  clog(req)
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
