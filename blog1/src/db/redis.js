const redis = require('redis')
const { REDIS_CONF } = require('../config/db')

//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.log(err)
})

function set(key, val) {
    // 当val是一个对象的时候就将他转成字符串
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get (key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            // 加入不存在该键值对
            if (val === null){
                resolve(null)
                return
            }

            // 尝试将获得到的转成对象，如果失败就会被catch到
            try {
                resolve(
                    JSON.parse(val)
                )
            } catch(ex) {
                resolve(val)
            }
        })
    })
    return promise
}

module.exports = {
    set,
    get
}