const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async function(ctx, next) {
    const { username, password } = ctx.request.body
    // const result = login(username, password)
    // return result.then(data => {
    //     if (data.username) {
    //         // 设置 session
    //         req.session.username = data.username
    //         req.session.realname = data.realname
    //
    //         res.json(
    //             new SuccessModel()
    //         )
    //         return
    //     }
    //     res.json(
    //         new ErrorModel('登录失败')
    //     )
    // })
    const data = await login(username, password)
    if (data.username) {
        // 设置 session
        ctx.session.username = data.username
        ctx.session.realname = data.realname

        ctx.body = new SuccessModel()
        return
    }
    ctx.body = new ErrorModel('登录失败')
});

module.exports = router;
