const router = require('koa-router')()

const { getList, getDetail ,newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async function(ctx, next) {
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''

    if(ctx.query.isadmin) {
        // 管理员界面
        if(ctx.session.username){
            ctx.body = new ErrorModel('未登录')
            return
        }

        //强制查询自己的博客
        author = ctx.session.username
    }

    // const result = getList(author, keyword)
    // return result.then(listData =>{
    //     ctx.body = new SuccessModel(listData)
    // })
    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)
});

router.get('/detail', async (ctx, next) => {
    // const result = getDetail(req.query.id)
    // return result.then(data => {
    //     res.json(
    //         new SuccessModel(data)
    //     )
    // })
    const data = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)
});

router.post('/new', loginCheck, async (ctx, next) => {
    ctx.request.body.author = ctx.session.username
    // const result = newBlog(req.body)
    // return result.then(data => {
    //     res.json(
    //         new SuccessModel(data)
    //     )
    // })
    const data = await newBlog(ctx.request.body)
    ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx, next) => {
    // const result = updateBlog(req.query.id, req.body)
    // return result.then(val => {
    //     if (val) {
    //         res.json(
    //             new SuccessModel()
    //         )
    //     } else {
    //         res.json(
    //             new ErrorModel('更新博客失败')
    //         )
    //     }
    // })
    const val = await updateBlog(ctx.query.id, ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

router.post('/del', loginCheck, async (ctx, next) => {
    const author = ctx.session.username
    // const result = delBlog(req.query.id, author)
    // return result.then(val => {
    //     if (val) {
    //         res.json(
    //             new SuccessModel()
    //         )
    //     } else {
    //         res.json(
    //             new ErrorModel('删除博客失败')
    //         )
    //     }
    // })
    const val = await delBlog(req.query.id, author)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('删除博客失败')
    }
})

module.exports = router
