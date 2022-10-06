// import {instance} from './axios.js'
let {instance} = require('./axios')
let getExtend = (filename) => {
    let reg = /(?<=^.*\.)\w*$/
    let res = filename.match(reg)
    if (!res) {
        return null
    } else {
        return res[0]
    }
}

module.exports = {
    instance,
    getExtend,
}