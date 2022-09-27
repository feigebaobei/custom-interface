const fsPromises = require('fs/promises')
const path = require('path')
const initSqlJs = require('sql.js/dist/sql-wasm.js') 

let initDb = async () => {
    let fileSqlite = await fsPromises.readFile(path.resolve(__dirname, './file.sqlite'))
    let SQL = await initSqlJs()
    return new SQL.Database(fileSqlite)
}

module.exports = {
    dbPromise: initDb()
}