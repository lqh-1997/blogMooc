const mysql = require('mysql')

//创建连接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'myblog'
})

//开始连接
con.connect()

//s执行sql语句，然后回调
// const sql = 'select * from users;'
const sql = `update users set realname='李四2' where realname = '李四';`
con.query(sql, (err, result) => {
    if(err) {
        console.log(err)
        return
    }
    console.log(result)
})

//关闭连接
con.end()
