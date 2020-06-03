### MongoDB的介绍及安装
在上几节我们讲了MySQL数据库，它是一种关系型数据库，而MongoDB使用c++编写的非关系型数据库
##### 1. mysql和MongoDB区别
<table style="text-align: center;">
    <tr>
        <th></th>
        <th>MongoDB</th>
        <th>MySQL</th>
    </tr>
    <tr>
        <td>数据库模型</td>
        <td>非关系型</td>
        <td>关系型</td>
    </tr>
    <tr>
        <td>表</td>
        <td>collection集合</td>
        <td>table二维表</td>
    </tr>
    <tr>
        <td>表的行数据</td>
        <td>document文档</td>
        <td>row记录</td>
    </tr>
    <tr>
        <td>数据结构</td>
        <td>虚拟内存+持久化</td>
        <td>不同引擎不同存储方式</td>
    </tr>
    <tr>
        <td>查询语句</td>
        <td>MongoDB查询方式（类似于js函数）</td>
        <td>sql语句</td>
    </tr>
    <tr>
        <td>数据处理</td>
        <td>将热数据存储在物理内存中，从而达到快速读写</td>
        <td>不同引擎有自己的特点</td>
    </tr>
    <tr>
        <td>事务性</td>
        <td>不支持</td>
        <td>支持事务</td>
    </tr>
    <tr>
        <td>占用空间</td>
        <td>占用空间大</td>
        <td>占用空间小</td>
    </tr>
    <tr>
        <td>join操作</td>
        <td>没有join</td>
        <td>支持join</td>
    </tr>
</table>

##### 2. MongoDB安装
- 数据库软件安装 https://www.mongodb.com/download-center/community
- 可视化软件安装 https://www.mongodb.com/download-center/compass

##### 3. 启动MongoDB命令
以下命令，需要以管理员身份运行命令行工具才可以执行
```
启动MongoDB
net start mongodb
关闭MongoDB
net stop mongodb
```
##### 4. 启动MongoDB Compass 可视化管理工具
保证MongoDB启动后，直接打开这个管理工具即可
##### 5. 使用mongoose连接MongoDB数据库
- 安装mongoose包
```
npm/cnpm install mongoose
```