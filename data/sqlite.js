// fsPromises.readFile(path.resolve(__dirname, './file.sqlite')).then(fileBuffer => {
//     return initSqlJs().then((SQL) => {
//       const db = new SQL.Database(fileBuffer)
//       return db
//     })
//   }).then((db) => {
//     let result = db.exec('SELECT * FROM hello')
//     res.status(200).json({
//       code: 0,
//       message: '',
//       data: result
//     })
//   })

const fsPromises = require('fs/promises')
const path = require('path')
const initSqlJs = require('sql.js/dist/sql-wasm.js') 


// let dbPromise = async (filePath) => {
let initDb = async () => {
    // console.log('23456543')
    let fileSqlite = await fsPromises.readFile(path.resolve(__dirname, './file.sqlite'))
    // let fileSqlite = undefined
    let SQL = await initSqlJs()
    return new SQL.Database(fileSqlite)
}

module.exports = {
    dbPromise: initDb()
}