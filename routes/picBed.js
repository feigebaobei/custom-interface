var express = require('express');
var cors = require('./cors')
var router = express.Router();
let bodyParser = require('body-parser');
const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
// const FormData = require('form-data')
// const { instance } = require('../utils');
const multer = require('multer')
// const Blob = require('node-blob')
// const config = require('../config')
const {dbPromise} = require('../data/sqlite')
const md5 = require('md5')
const {getExtend} = require('../utils/index')
// const clog = console.log

router.use(bodyParser.json())

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images/picBed')
//   },
//   filename: (req, file, cb) => {
//     let reg = new RegExp(`^.*(?=\.(${config.imageExtend.join('|')})$)`)
//     let res = file.originalname.match(reg)
//     let [name, extend] = res
//     // [name, extend, index: n, input: 'string', group: undefined]
//     // 原始名称 + 时间戳 + 5位随机数
//     cb(null, `${name}${Date.now()}${Math.floor(Math.random() * 100000)}.${extend}`)
//     // cb(null, `${file.originalname}-${Date.now()}`)
//   }
// })
let imageFileFilter = (req, file, cb) => {
if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  return cb(new Error('You can upload only image files!'), false)
}
cb(null, true)
}
let upload = multer({
  // storage,
  storage: multer.memoryStorage(),
  // 若使用硬盘存，则上传成功后一定会存在硬盘中。实际需要经过判断后再决定存不存。所以使用内存存。
  fileFilter: imageFileFilter
})

// 测试用的代码
// dbPromise.then(db => {
//     // let sqlstr = "CREATE TABLE picBed (photoName char, tags blob);"// \
//   // INSERT INTO picBed VALUES ('wert.png', [1, 2]); \
//   // INSERT INTO picBed VALUES ('abd.png', [32]);"

//   // let sqlstr = "INSERT INTO picBed VALUES (0, 'wert.png');" //  \
// // let sqlstr = "INSERT INTO picBed VALUES ('abd.png', '[32]');"
//   // db.run(sqlstr) // 
//   let result = db.exec('SELECT * FROM picBed')
//   // // console.log('result', result, result[0].values)
//   console.log('全部数据', result)
//   if (result.length) {
//     result = result[0].values.splice(-9) // for test
//     result = result.map(item => item[0])
//     clog('result', result)
//     result.map(filename => {
//       let filePath = path.resolve(__dirname, '../public/images/picBed', filename)
//       fsPromises.stat(filePath).then(stat => {
//         // 存在
//         if (stat.isFile()) {
//           fsPromises.unlink(filePath)
//           // db.run(`DELETE FROM picBed WHERE photoName = '${filename}';`) // 必须要有引号
//         }
//         // clog('stat', stat)
//       }).catch(error => {
//         // 不存在
//         // clog('error', error)
//       }).finally(() => {
//         db.run(`DELETE FROM picBed WHERE photoName = '${filename}';`)
//       })
//     })
//   }
//   // console.log(result, result[0].values)
//   // db.run(`DELETE FROM picBed WHERE photoName = 'abd.png';`) // 必须要有引号
  
//   // db.exec('DROP TABLE picBed;') // 删除表

//   // 落盘
//   // let data = db.export()
//   // const buffer = Buffer.from(data);
//   // fsPromises.writeFile(path.resolve(__dirname, "../data/file.sqlite"), buffer)
//   // .then(r => {
//   //   console.log(r, db.exec('SELECT * FROM picBed'))
//   // })
// }).catch(e => {
//   console.log('e', e)
// })

router.route('/')
.options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})
.get(cors.corsWithOptions, async (req, res) => {
  // let db = await 
  let db = await dbPromise
  let data = db.exec('SELECT * FROM picBed')
  if (data.length) {
    data = data[0].values.map(item => {
      return {
        filename: item[0],
        tags: item[1].split(','),
      }
    })
  }
  res.status(200).json({
    code: 0,
    message: '',
    data: data
  })
})
.post(cors.corsWithOptions, 
  upload.fields([
    {name: 'photo', maxCount: 1},
  ]),
  async (req, res) => {
    // // 1. 取出要删除的文件stat
    // // 2. 删除它们
    // // 3. 保存本次上传的文件
    // //   处理文件的名字。
    // // 4. 保存在数据库中
    if (!req.files.photo) {
      return res.status(200).json({ // 打断
        code: 1,
        message: "请上传文件",
        data: {},
      })
    }

    let extend = getExtend(req.files.photo[0].originalname)
    if (!extend) {
      return res.status(200).json({ // 打断
        code: 1,
        message: "上传的文件不正确",
        data: {},
      })
    }

    let db = await dbPromise
    let allItem = db.exec('SELECT * FROM picBed') // [0].values
    if (allItem.length && allItem[0].values.length >= 9) {
      let toDelAllItem = allItem[0].values.slice(0, -9)
      toDelAllItem = toDelAllItem.map(item => item[0])
      toDelAllItem.forEach(filename => {
        let filePath = path.resolve(__dirname, '../public/images/picBed', filename)
        fsPromises.stat(filePath).then(stat => {
          if (stat.isFile()) {
            fsPromises.unlink(filePath)
          }
        }).catch(error => {
        }).finally(() => {
          db.run(`DELETE FROM picBed WHERE photoName = '${filename}';`)
        })
      })
    }
    let hashName = md5(`${req.files.photo[0].originalname}${new Date().getTime()}${String(Math.floor(Math.random() * 1000))}`) + '.' + extend
    // 这里的数据类型可能不对
    db.run(`INSERT INTO picBed VALUES ('${hashName}', '${req.body.tags}');`)
    fsPromises.writeFile(path.resolve(__dirname, '../public/images/picBed', hashName), req.files.photo[0].buffer).then(() => {
      res.status(200).json({
        code: 0,
        message: "ok",
        data: hashName,
      })
    })
})
.put(cors.corsWithOptions, (req, res) => {
  res.send('put')
})
.delete(cors.corsWithOptions, (req, res) => {
  res.send('delete')
})

module.exports = router;
