const http = require('http')

class express{
    constructor () {
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    preHandle (path) {
        const info = {}
        if (typeof path !== 'string'){
            info.path = '/'
            info.stack = [].slice.call(arguments, 0)
        } else {
            info.path = path
            info.stack = [].slice.call(arguments, 1)
        }
        return info
    }

    use () {
        const info = this.preHandle.apply(this, arguments)
        this.routes.all.push(info)
    }

    get () {
        const info = this.preHandle.apply(this, arguments)
        this.routes.get.push(info)
    }

    post () {
        const info = this.preHandle.apply(this, arguments)
        this.routes.post.push(info)
    }

    match (method, url) {
        let stack = []
        if (url === '/favicon.ico') {
           return stack
        }

        let currentStack = []
        currentStack = currentStack.concat(this.routes.all)
        currentStack = currentStack.concat(this.routes[method])

        currentStack.forEach((item) => {
            if (url.indexOf(item.path) === 0) {
                stack = stack.concat(item.stack)
            }
        })
        return stack
    }

    handleNext (req, res, list) {
        const next = () => {
            const middleware = list.shift()
            if (middleware) {
                middleware(req, res, next)
            }
        }

        next()
    }

    callback () {
        return (req, res) => {

            //配置res.json
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(JSON.stringify(data))
            }

            const method = req.method.toLowerCase()
            const url = req.url

            //不考虑next的所有匹配方法
            let resultList = this.match(method, url)

            // next匹配
            this.handleNext(req, res, resultList)
        }
    }

    listen (...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = () => {
    return new express()
}

