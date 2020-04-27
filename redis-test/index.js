const redis = require('redis')

//创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1')
redisClient.on('error', err => {
    console.log(err)
})


// 测试 第三个参数会打印出来设置是否正确
redisClient.set('myname', 'lisi', redis.print)
redisClient.get('myname', (err, val) => {
    if(err) {
        console.log(err)
        return
    }
    console.log(val)

    //退出
    redisClient.quit()
})