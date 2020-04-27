const fs = require('fs')
// 使用path是为了防止不同的系统路径拼接方式不同
const path = require('path')

//获取当前目录下的data.txt
const fileName = path.resolve(__dirname, 'data.txt')

//读取文件
fs.readFile(fileName, (err, data) => {
    if(err){
        console.error(err)
        return
    }
    // data是二进制类型，需要转换为字符串，如果文件过大，data也会有和文件同样的大小，内存吃不消
    console.log(data.toString())
})

// 写入文件
const content = 'new write\n'
const opt = {
    flag: 'a' // a代表append追加写入 w代表覆盖写入
}
fs.writeFile(fileName, content, opt, (err) => {
    if (err) {
        console.error(err)
    }
})

//判断文件是否存在(似乎不是异步)
fs.exists(fileName, (exists) => {
    console.log('exists', exists)
})
