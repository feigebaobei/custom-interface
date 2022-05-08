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
    version: "1.0.0",
    code: 1,
    message: "ok",
    data: [
      ['date', 'area', 'num', 'age'], // 表头行
      ['2022-01-01', '北京', 1000, 23] // 至少要有一行示例数据！！！
    ],
  })
})
.post(cors.corsWithOptions, (req, res) => {
  clog(req.body)
  let dataHead = [ 'date', 'area', 'num', 'age' ]
  let dataBody = [
      // [ 'date', 'area', 'num', 'temp' ],
      // [ { value: '2022-01-01' }, { value: '北京' }, { value: 1000 }, { value: 24, extra: { other: 0.1234 } } ],
      // 等价于
      [ '2022-03-01', '上海市', 1000, 19, { value: 23, extra: { other: 0.1234 } } ],
      [ '2022-01-26', '北京市', 823, 22, { value: 23, extra: { other: 0.1234 } } ],
      [ '2022-12-01', '广州市', 654, 27, { value: 24, extra: { other: 0.1234 } } ],
      [ '2022-01-16', '深圳市', 1000, 34, { value: 26, extra: { other: 0.1234 } } ],
    ]
  if (req.body.filters.length) {
    let operator = req.body.filters[0].operator
    let threshold = req.body.filters[0].values[0]
    threshold = Number(threshold)
    switch (operator) {
      case 'gt':
        dataBody = dataBody.filter(item => {
          return item[3] > threshold
        })
        break
      case 'lt':
        dataBody = dataBody.filter(item => {
          return item[3] < threshold
        })
        break
      case 'eq':
        dataBody = dataBody.filter(item => {
          return item[3] === threshold
        })
        break
      default:
        break
    }

  }
  res.status(200).json({
    version: "1.0.0",
    code: 1,
    message: "ok",
    meta: [
      { key: 'date', title: '日期', type: 'text' },
      { key: 'area', title: '区域', type: 'text' },
      { key: 'age', title: '年龄', type: 'number' },
      { key: 'num', title: '数量', type: 'number', format: "0,0.00" },
      // { key: 'temp', title: '温度', type: 'json<number>', format: "0,0.0", extra: { other: { type: 'number', format: '0.00' } } }
    ],
    data: [dataHead, ...dataBody],
  }
  )
})
.put(cors.corsWithOptions, (req, res) => {
  res.send('put')
})
.delete(cors.corsWithOptions, (req, res) => {
  res.send('delete')
})

module.exports = router;
