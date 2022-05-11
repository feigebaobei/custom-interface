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
    code: 0,
    message: "ok",
    data: [
      ['date', 'area', 'num', 'age'], // 表头行
      ['2022-01-01', '北京', 1000, 23] // 至少要有一行示例数据！！！
    ],
  })
})
.post(cors.corsWithOptions, (req, res) => {
  clog(req.body)
  // {
  //   filters: [
  //     {
  //       memeber: string,
  //       operator: string,
  //       values: string[],
  //     }, ...
  //   ]
  // }

  let dataHead = [ 'date', 'area', 'num', 'age' ]
  let dataBody = [
      // [ 'date', 'area', 'num', 'temp' ],
      // [ { value: '2022-01-01' }, { value: '北京' }, { value: 1000 }, { value: 24, extra: { other: 0.1234 } } ],
      // 等价于
      [ '2022-03-01', '上海市', 1255, 19 ],
      [ '2022-01-26', '北京市', 823, 22 ],
      [ '2022-12-01', '广州市', 654, 27 ],
      [ '2022-02-14', '深圳市', 2953, 34 ],
      [ '2021-11-07', '太原市', 2513, 18 ],
      [ '2022-01-28', '济南市', 251, 19 ],
      [ '2021-01-18', '福州市', 924, 37 ],
      [ '2021-11-30', '广安市', 1853, 18 ],
      [ '2022-01-06', '南昌市', 1493, 28 ],
      [ '2021-12-02', '湛江市', 1743, 26 ],
      [ '2022-02-08', '南充市', 2170, 17 ],
      [ '2022-01-19', '南通市', 952, 11 ],
      [ '2021-11-13', '南京市', 816, 4 ],
      [ '2022-01-24', '长沙市', 964, 38 ],
      [ '2021-12-17', '宜昌市', 713, 26 ],
      [ '2022-02-14', '济宁市', 1835, 22 ],
      [ '2022-02-12', '青岛市', 1572, 25 ],
      [ '2021-12-07', '大连市', 727, 18 ],
    ]
  if (req.body.filters && req.body.filters.length) {
    for (let i = 0; i < req.body.filters.length; i++) {
      let filterItem = req.body.filters[i]
      dataBody = dataBody.filter((dataItem) => {
        let index = dataHead.findIndex((ele) => {return ele === filterItem.member}) // filterItem.member)
        // clog(index)
        if (index >= 0) {
          let bool = false
          switch(filterItem.operator) {
            case 'gt':
              bool = dataItem[index] > Number(filterItem.values[0] || 0)
              break
            case 'equals':
              bool = (dataItem[index] === Number(filterItem.values[0] || 0)) // number
                    || (dataItem[index] === filterItem.values[0]) // string
              break
            case 'lt':
              bool = dataItem[index] < Number(filterItem.values[0] || 0)
              break
            case 'inDateRange':
              let v = new Date(dataItem[index]).getTime()
              let v0 = new Date(filterItem.values[0]).getTime()
              let v1 = new Date(filterItem.values[1]).getTime()
              clog(v, v0, v1)
              // bool = v >= (dataItem[values][0] || 0) && v <= (dataItem[values][1] || 0)
              bool = v >= v0 && v <= v1
              break
            default:
              break
          }
          return bool
        } else {
          return true
        }
      })
    }
  }
  res.status(200).json({
    version: "1.0.0",
    code: 0,
    message: "ok",
    meta: [
      { key: 'date', title: '日期', type: 'date' },
      { key: 'area', title: '区域', type: 'text' },
      { key: 'num', title: '数量', type: 'number' },
      { key: 'age', title: '年龄', type: 'number' },
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
