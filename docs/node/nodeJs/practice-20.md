### MongoDB如何导入文件数据
首先新建`user.json`文件
```json
{ "name": "1", "city": "上海", "sex": 1}
{ "name": "2", "city": "北京", "sex": 2}
{ "name": "3", "city": "广州", "sex": 2}
{ "name": "4", "city": "深圳", "sex": 1}
```
- 数据库导入数据
```
mongoimport -d 数据库名称 -c 集合名称 --file 导入的数据文件路径
```
这行语句是在cmd命令行工具下执行的，要想执行这条语句，首先需要配置环境变量，mac和windows都需要配置，这里只讲一下windows下如何配置，mac配置可以去网上搜索一下<br>
快捷键win+r，输入`sysdm.cpl`然后回车，打开系统属性-->高级-->环境变量-->系统变量，找到`path`，然后把MongoDB安装路径添加进来`D:\Program Files (x86)\MongoDB\bin`<br>
cmd进入`user.json`这个目录，执行命令：
```
E:\project\vue\NodeJs\2-11>mongoimport -d test -c users --file ./user.json
```
这样我们打开`MongoDB Compass`找到`test`数据库下的`users`集合，可以看到增加了4条数据