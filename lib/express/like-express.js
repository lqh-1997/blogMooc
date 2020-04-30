const http = require('http')
const slice = Array.prototype.slice

class LikeExpress{
    constructor() {
        // 存放中间件的列表
        this.routes = {
            // use的方法存放在all里面
            all: [],
            // get的方法存放在get里面
            get: [],
            // post的方法都放在post里面
            post: []
        }
        this.times = 0
    }

    // 用来分析第一个参数
    register(path) {
        const info = {}
        // 没有输入第一个参数就是根路由 arguments就是function
        info.times = this.times++
        if(typeof  path === 'string'){
            info.path = path
            info.stack = slice.call(arguments, 1)
        }else{
            info.path = '/'
            info.stack = slice.call(arguments, 0)
        }
        return info
    }

    use() {
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }

    match(method, url){
        let stack = []
        if(url === '/favicon.ico'){
            return stack
        }

        // 获取route
        let curRoutes = []
        // FIXME
        let curTime = 0
        let curAll = 0
        let curMethod = 0
        while(curTime < this.times) {
            console.log(curTime)
            if (this.routes.all.length === 0) {
                curRoutes = curRoutes.concat(this.routes[method])
                break
            } else if (this.routes[method].length === 0) {
                curRoutes = curRoutes.concat(this.routes.all)
                break
            } else if (this.routes.all[curAll] && this.routes.all[curAll].times === curTime){
                curRoutes.push(this.routes.all[curAll])
                curAll++
                curTime++
            } else if (this.routes[method][curMethod] && this.routes[method][curMethod].times === curTime){
                curRoutes.push(this.routes[method][curMethod])
                curMethod++
                curTime++
            // 没有匹配
            } else {
                curTime++
                continue
            }
        }
        // curRoutes = curRoutes.concat(this.routes.all)
        // // curRoutes = curRoutes.concat(this.routes[method])
        // console.log(this.routes.all)
        // console.log(this.routes[method])

        curRoutes.forEach(routeInfo => {
            // 如果根目录==='/api' url==='/api/get-cookie'
            // 用来判断这个条件成立就push进stack
            if(url.indexOf(routeInfo.path) === 0) {
                //routeInfo => curRoutes => this.routes.xx => register/info
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }

    // next机制，stack是由所有匹配的方法组成的一个数组
    handle(req, res , stack){
        // 在回调里面定义一个next函数然后立即执行
        const next = () => {
            // 拿到第一个匹配的中间件
            const middleware = stack.shift()
            if (middleware) {
                // 执行中间件函数，如果函数中包含next，则它会继续调用该方法，不过不包含next，则中断
                middleware(req, res, next)
            }
        }
        next()
    }

    callback(){
        return (req,res) => {
            // 给res封装json方法
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()

            // 数组包含所有可用的方法(不考虑next的情况下所有匹配的方法)
            const resultList = this.match(method, url)

            // 然后传进去，考虑next
            this.handle(req, res, resultList)
        }
    }

    // 监听端口，并且运行回调 createSever接收一个函数(res, req) => {}
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = () => {
    return new LikeExpress()
}
