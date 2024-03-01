require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mysql = require('mysql2/promise');
const cors = require('@koa/cors'); // 引入cors中间件

const app = new Koa();
const router = new Router();

// 使用CORS中间件，可以传递一个配置对象来自定义行为
// 下面的配置允许所有域名的跨域请求
app.use(cors());


// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};


// API路由：接收JSON数据并保存到数据库
router.post('/messages', async (ctx) => {
    const connection = await mysql.createConnection(dbConfig);
    const { body } = ctx.request;
    const [result] = await connection.execute(
        `INSERT INTO shuishanLLM (messages) VALUES (?)`,
        [JSON.stringify(body)]
    );
    connection.end();

    ctx.body = {
        message: 'Data saved successfully',
        data: body,
        result
    };
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
