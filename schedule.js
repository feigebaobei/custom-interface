const schedule = require('node-schedule');
const {dbPromise} = require('./data/sqlite');
const path = require('path')
const fsPromises = require('fs/promises')

const job = schedule.scheduleJob('20 * * * * *', function(){
  dbPromise.then(db => {
    let data = db.export()
    const buffer = Buffer.from(data);
    fsPromises.writeFile(path.resolve(__dirname, "./data/file.sqlite"), buffer);
  })
});