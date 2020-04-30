const http = require('http')

const server = http.createServer((req, res) => {
    res.setHeader('Content-type', "application/json")
    res.end(
        JSON.stringify({
            errno: 0,
            msg: 'pm2 test server 1'
        })
    )
})

server.listen(8000, () => {console.log("listen on 8000")})
