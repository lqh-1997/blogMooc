// 标准输入输出(一旦输入完马上就会输出出来)
// process.stdin.pipe(process.stdout)
// const http = require('http')
//
// const server = http.createServer((req, res) => {
//     if(req.method === 'POST'){
//         // 通过pipe将数据传递到res(一点一点传递)
//         req.pipe(res)
//     }
// })
// server.listen(8000)





// 复制文件
// const fs = require('fs')
// const path = require('path')
//
// const fileName1 = path.resolve(__dirname, 'data.txt')
// const fileName2 = path.resolve(__dirname, 'data-bak.txt')
//
// const readStream = fs.createReadStream(fileName1)
// const writeStream = fs.createWriteStream(fileName2)
//
// readStream.pipe(writeStream)
//
// readStream.on('data', chunk => {
//     console.log(chunk.toString())
// })
//
// readStream.on('end', () => {
//     console.log('done')
// })





// 服务器访问文件
const http = require('http')
const fs = require('fs')
const path = require('path')
const fileName1 = path.resolve(__dirname, 'data.txt')
const server = http.createServer((req, res) => {
    if(req.method === 'GET'){
        const readStream = fs.createReadStream(fileName1)
        readStream.pipe(res)
    }
})
server.listen(8000)
