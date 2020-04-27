const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    console.log('连接成功')
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const query = querystring.parse(url.split('?')[1])

    // 设置返回格式为JSON
    res.setHeader('Content-type', 'application-json')

    // 定义返回数据
    const resData = {
        method,
        url,
        path,
        query
    }

    // 返回
    if (method === 'GET') {
        res.end(JSON.stringify(resData))
    }
    if (method === 'POST') {
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            res.end(JSON.stringify(resData))
        })
    }
})
// const querystring = require('querystring')

// const server = http.createServer((req, res) => {
//     console.log(req.method)
//     const url = req.url
//     req.query = querystring.parse(url.split('?')[1])
//     console.log(req.query)
//     res.end(
//         JSON.stringify(req.query)
//     )
// })

// const server = http.createServer((req, res) => {
//     console.log('listen on 8000')
//     if(req.method === 'POST'){
//         console.log('req content-type: ' + req.headers['content-type'])
//         console.log(req+ 'req')
//         // 定义一个字符串等待接收
//         let postData = ''
//         //监听data数据流，只要每接收到一个数据流就会触发一次下面的函数
//         req.on('data', chunk => {
//             postData += chunk.toString()
//         })

//         // 当数据接收完成之后就会触发下面的函数
//         req.on('end', () => {
//             console.log(postData)
//             res.end('hello')
//         })
//     }
// })

server.listen(8000)