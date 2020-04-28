var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')

var app = express();

// 视图引擎设置(前端部分)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 日志记录
const ENV = process.env.NODE_ENV
if(ENV !== 'production'){
  app.use(logger('dev'))
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined',{
    stream: writeStream
  }));
}
// 获取post data json格式
app.use(express.json());
// urlencoded格式
app.use(express.urlencoded({ extended: false }));
// 获取所有的cookie
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
// 解析session secret密钥
app.use(session({
  secret: 'Esio#4561_',
  cookie: {
    path: '/',  // 默认配置
    httpOnly: true,  //默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

// 注册路由
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
