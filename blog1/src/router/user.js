const { login } =  require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

// 获取cookie的过期时间
const getCookieExpire = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    // 转换成cookie中的时间格式
    // console.log(d.toGMTString())
    return d.toGMTString()
}

const handleUserRouter = (req, res) => {
    const method = req.method

    //登录
    if (method === 'POST' && req.path === '/api/user/login'){
        const { username, password } = req.body
        // const { username, password } = req.query
        let result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 设置session
                req.session.username = data.username
                req.session.realname = data.realname
                // 同步到redis
                set(req.sessionId, req.session)
                // console.log('reqSession is', req.session)
                return new SuccessModel()
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }

    // 登录验证测试
    // if (method === 'GET' & req.path === '/api/user/login-test') {
    //     console.log(req.session)
    //     if (!req.session.username) {
    //         return Promise.resolve(new SuccessModel({
    //                 session: req.session
    //             })
    //         )
    //     }
    //     // 操作cookie
    //     // res.setHeader('Set-Cookie', `username=zhangsan; path=/; httpOnly; expires=${getCookieExpire()}`)
    //     return Promise.resolve(new ErrorModel('尚未登陆'))
    // }

}

module.exports = handleUserRouter
