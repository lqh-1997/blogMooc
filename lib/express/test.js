const express = require('./like-express')

const app = express()

app.use((req, res, next) => {
    console.log('请求开始..', req.method, req.url)
    next()
})

app.use((req, res, next) => {
    req.cookie = {
        userId: '123'
    }
    next()
})

app.use((req, res, next) => {
    setTimeout(() => {
        req.body = {
            a: 100
        }
        next()
    })
})

app.use('/api', (req, res, next) => {
    console.log('处理api')
    next()
})

app.get('/api', (req, res, next) => {
    console.log('处理get,api')
    next()
})
app.post('/api', (req, res, next) => {
    console.log('处理post,api')
    next()
})

app.get('/api/get-cookie', (req, res, next) => {
    console.log('处理getCookie,api')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.post('/api/get-post-data', (req, res, next) => {
    console.log('处理post data,api')
    res.json({
        errno: 0,
        data: req.body
    })
})

app.use((req, res, next) => {
    console.log('404')
    res.json({
        errno: -1
    })
})

app.listen(3000, () => {
    console.log('running on 3000')
})
