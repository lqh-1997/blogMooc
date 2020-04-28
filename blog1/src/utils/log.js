const fs = require('fs')
const path = require('path')

function writeLog(writeStream, log) {
    writeStream.write(log + '\n')
}

// 生成 write Stream
function createWriteStream(fileName){
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a'
    })
    return writeStream
}

// 写访问日志
const env = process.env.NODE_ENV
const accessWriteStream = createWriteStream('access.log')
function access(log){
    if (env === 'dev') {
        console.log(log)
        return
    }
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}
