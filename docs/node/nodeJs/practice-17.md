# 17-nodeJs连接Mysql

需要先安装MySQL和Navicat，关于如何安装可以自行百度解决，这里主要介绍如何使用node连接已在本地成功安装的mysql数据库

## 1. 什么是mysql

mysql是一个数据库管理系统，数据库是存储，管理数据的仓库，操作MySQL需要熟悉一些常用的语句，比如增删改查，排序，模糊查询等

- 增加表格数据

```sql
-- 向use_list表插入一条数据
INSERT INTO use_list (name, city, sex) VALUE ('王伟', '杭州', 2);
-- 向use_list表插入多条数据
INSERT INTO use_list (name, city, sex) VALUES ('王伟', '杭州', 2),('蒋勇', '杭州', 2),('孙东辉', '杭州', 2),('王伟', '杭州', 2); 
```
- 删除表格数据
```sql
-- 删除id为3的用户
DELETE FROM use_list WHERE id = 3
-- 删除id为4到8之间的数据（包括边界）
DELETE FROM use_list WHERE id BETWEEN 4 AND 8
```
- 修改表格数据
```sql
-- 修改id为5的用户name和city
UPDATE use_list SET `name` = '王二', city = '甘肃' WHERE id = 2
```
- 查询表格数据
```sql
-- 查询整个表格
SELECT * FROM use_list
-- 查询某个key
SELECT `name` FROM use_list
-- 带条件查询
SELECT * FROM use_list WHERE sex = 2
```
- 表格排序
```sql
-- 根据id降序排列数据
SELECT * FROM use_list ORDER BY id DESC
-- 根据id升序排列数据
SELECT * FROM use_list ORDER BY id ASC
```
- 模糊查询表格
```sql
-- 匹配名字带有王的用户
SELECT * FROM use_list WHERE `name` LIKE '%王%'
```
以上是常用的MySQL语句，关于更多用法可以参考此文章[MySQL查询语句大全](https://www.cnblogs.com/mofujin/p/11355517.html)

## 2. nodejs连接MySQL

如果在node操作MySQL，需要安装mysql模块，这个模块可以通过npm安装
```
npm/cnpm install mysql --save
```
同样安装这个模块，别忘记在你的项目目录下执行`npm init -y`生成`package.json`文件，便于对你项目中所安装的模块进行管理

接下来就看一下具体操作数据库的流程：
```js
const mysql = require('mysql')

// 创建连接
const conn =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    port: '3306',
    database: 'test'
})

// 建立连接
conn.connect()

// 执行sql查询语句
let sql = 'select * from use_list where sex = ?' // ?为占位符
conn.query(sql, [2], (err, res) => {
    if (err) throw err
    console.log(res)
})

// 关闭连接
conn.end()
```
如果要传入多个查询条件，可以这样写：
```js
// 执行sql查询语句
let sql = 'select * from use_list where sex = ? and city = ?' // ?为占位符
conn.query(sql, [2, '杭州'], (err, res) => {
    if (err) throw err
    console.log(res)
})
```
## 3. 深度讲解MySQL连接池

这里讲一下mysql连接池和普通连接池的区别以及它的使用方式

- 如果我们像上面的代码那样频繁的创建和关闭连接会降低系统的性能，提高系统的开销，创建mysql连接池则会避免这种情况的出现

- 连接池的使用
```js
const mysql = require('mysql')

// 创建连接池
const pool = mysql.createPool({
    connectionLimit: 10, // 最大连接数
    host: 'localhost',
    user: 'root',
    password: 'admin',
    port: '3306',
    database: 'test'
})

// 获取连接
pool.getConnection((err, conn) => {
    if (err) throw err
    // 执行sql查询语句
    let sql = 'select * from use_list where sex = ? and city = ?' // ?为占位符
    conn.query(sql, [2, '杭州'], (err, res) => {
        conn.release() // 释放连接
        if (err) throw err
        console.log(res)
    })
})
```
