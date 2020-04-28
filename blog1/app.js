const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 获取cookie的过期时间
const getCookieExpire = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    // 转换成cookie中的时间格式
    console.log(d.toGMTString())
    return d.toGMTString()
}

// 初始化session
// const SESSION_DATA = {}

// 用于处理postdata
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        // 请求头不为post
        if (req.method !== 'POST'){
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json'){
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if(!postData){
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    //记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    //设置返回格式JSON
    res.setHeader('Content-type', 'application/json')

    const url = req.url
    req.path = url.split('?')[0]

    // 解析query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        // 设置cookie会自动加空格
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val

        // console.log(req.cookie)
    })

    // 解析session 直接存在内存中
    // let needSetCookie = false
    // let userId = req.cookie.userId
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    //解析session，存储在redis
    let needSetCookie = false
    let userId = req.cookie.userId
    if (!userId){
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化session
        set(userId, {})
    }
    // 获取session
    req.sessionId = userId
    get(userId).then(sessionData => {
        if (sessionData === null) {
            // 初始化redis中的session值
            set(req.sessionId, {})
            // 设置session
            req.session = {}
        } else {
            // 设置session
            req.session = sessionData
        }
        // console.log('req.session', req.session)

        // 处理postData
        return getPostData(req)
    }).then(postData => {
        req.body = postData

        //处理blog路由
        // const blogData = handleBlogRouter(req, res)
        // if (blogData) {
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpire()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        //处理user路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
             userResult.then(userData => {
                 if (needSetCookie) {
                     res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpire()}`)
                 }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        // 返回404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 Not Found\n")
        res.end()
    })
}

module.exports = serverHandle


// const resData = {
//     name: 'lqh',
//     // 可以通过这种方式获取到开发的环境
//     env: process.env.NODE_ENV,
//     a: 'aa'
// }
// res.end(JSON.stringify(resData))
