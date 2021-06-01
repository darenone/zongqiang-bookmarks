# 利用gulp 4.0搭建前端项目

> 代码示例已上传至GitHub代码库[JS-Web-Skill](https://github.com/darenone/JS-Web-Skill.git)，你可以下载下来启动项目，帮助你阅读本篇文章

> 本篇文章我已放到我的博客[zongqiang-bookmarks](https://darenone.github.io/zongqiang-bookmarks/)，你可以访问我的博客阅读更多文章内容


如果需要使用gulp，首先保证你的电脑已经安装了node，如果没有安装node可以去node官网安装

然后cmd中输入以下命令，查看本地是否安装了gulp
```
gulp --version // 2.0.1
```
cmd中输入以下命令，查看本地是否安装了node
```
node --version // 12.16.2
```
这里需要注意，如果你的node升级到了10，而本地安装的是gulp旧版本，比如2版本，就不能正常运行，需要先卸载gulp然后再重新安装最新的版本（截止到2020-10-12，gulp最新版本是4.0.2）

由于我的版本过低，这里我先把老版本的gulp卸载掉，执行如下命令：
```
npm uninstall gulp --global
```
在我的电脑上cmd执行`npm uninstall gulp -g`竟然报错，报错内容如下：
> Maximum call stack size exceeded

试了好多方式仍然不行，可能是因为node或者npm版本导致的，看来只有手动删除了，首先cmd中运行如下命令：
```
npm config list
```
可以看到输出的结果中有如下一行：
> prefix = "C:\\Users\\喔喔牛在路上\\AppData\\Roaming\\npm"

这是一个路径，你通过npm全局安装的插件都保存在这个位置，cmd中执行如下命令，进入到这个文件里：
```
cd C:\\Users\\喔喔牛在路上\\AppData\\Roaming\\npm
```
然后在这个文件的根目录下执行`dir`命令，查看都安装了哪些插件：
```
C:\Users\喔喔牛在路上\AppData\Roaming\npm>dir
```
输出结果如下：
```
C:\Users\喔喔牛在路上\AppData\Roaming\npm 的目录

2020/10/12  15:37    <DIR>          .
2020/10/12  15:37    <DIR>          ..
2020/07/15  15:53               332 cnpm
2020/07/15  15:53               283 cnpm.cmd
2020/07/15  15:53               502 cnpm.ps1
2019/01/28  15:42               321 grunt
2019/01/28  15:42               198 grunt.cmd
2020/10/12  15:37               346 gulp
2020/10/12  15:37               353 gulp.cmd
2020/10/12  15:37               516 gulp.ps1
2020/05/28  19:44               335 nodemon
2020/05/28  19:44               212 nodemon.cmd
2020/10/12  15:36    <DIR>          node_modules
2020/02/11  11:03               329 vue
2020/02/11  11:03               206 vue.cmd
2019/10/11  16:33               321 vuepress
2019/10/11  16:33               198 vuepress.cmd
2019/02/13  22:07               323 yarn
2019/02/13  22:07               200 yarn.cmd
2019/02/13  22:07               323 yarnpkg
2019/02/13  22:07               200 yarnpkg.cmd
```
咱们进入到这个文件夹，手动删除`gulp`，`gulp.cmd`，`gulp.ps1`，删除完毕关闭cmd，然后重新打开cmd输入如下命令：
```
gulp -v
```
输出结果如下：
> gulp' 不是内部或外部命令，也不是可运行的程序或批处理文件。

好了，这样代表已经删除成功，咱们再来重新安装gulp：
```
npm/cnpm install --global gulp-cli
```
安装完毕后创建一个项目，项目名为`JS_Web_Skill`

然后cmd进入到此项目的根目录，执行以下命令

```
1.cd JS_Web_Skill // 进入项目根目录
2.npm/cnpm init // 在项目根目录创建package.json文件
3.npm/cnpm install gulp --save-dev // 在项目里安装gulp，作为开发时的依赖
4.npm/cnpm install gulp-autoprefixer gulp-cache gulp-clean gulp-connect gulp-file-include gulp-imagemin gulp-jshint gulp-less gulp-minify-css gulp-minify-html gulp-rev gulp-rev-collector gulp-uglify gulp-util imagemin-pngquant http-proxy-middleware --save-dev // 安装这些gulp插件
```
如果要在你的项目里安装这些依赖，最好参考我的[S-Web-Skill/package.json](https://github.com/darenone/JS-Web-Skill/blob/master/package.json)里的插件版本安装，防止启动项目的时候报错

接下来改造我创建的项目`JS_Web_Skill`，其目录结构如下：

>题外话：为了方便了解某个项目，一般都会在readme文档里对整个项目的目录结构做个说明，这里说一下如何快速得到文件目录结构，首先你要全局安装
```
npm/cnpm install mddir -g
```
安装完毕，cd进入你的项目中：
```
cd E:\project\JS-Web-Skill
```
然后在此项目目录下执行mddir
```
E:\project\JS-Web-Skill>mddir
```
执行完毕，就可以在你的根目录下得到`directoryList.md`文件，这里面为你自动生成了文件目录，把它复制到你的readme.md文件中即可

代码我已上传至GitHub，也可以参考[JS-Web-Skill](https://github.com/darenone/JS-Web-Skill.git)来查看我是怎么创建的项目

关于项目中每个文件和文件夹的作用，我在[JS-Web-Skill/README.md](https://github.com/darenone/JS-Web-Skill/blob/master/README.md)做了介绍，你可以参考便于了解本项目，为什么选择把打包后的文件放到static文件中， 这是为了如果项目中使用node等服务层框架，可以一并打包放入dist下，这样，dist就是一个完整的包括前后端服务的项目目录了

为了区分开发环境和生产环境，所以在config文件夹里，使用`gulp.dev.js`来处理开发环境的任务，使用`gulp.prod.js`来处理生产环境的任务

## 1. config.js文件

```js
// config/config.js


module.exports = {
    dist: './dist/static', // 配置构建目录
}
```
## 2. gulp.dev.js文件

```js
// config/gulp.dev.js


const gulp = require('gulp');
// const { series, parallel, src, dest, watch } = require('gulp');

// const Jshint = require('gulp-jshint'); // js检查
const Gutil = require('gulp-util'); // 类似于console.log
const { createProxyMiddleware } = require('http-proxy-middleware'); // 跨域设置
const Less = require('gulp-less'); // 编译less
const FileInclude = require('gulp-file-include'); // 文件模块化
const Connect = require('gulp-connect'); // 浏览器刷新
const Clean = require('gulp-clean'); // 清理目录

// 获取配置文件
const config = require('./config');
const { dist } = config;

// 压缩html
async function html() {
    return gulp.src('src/views/*.html')
        .pipe(FileInclude({ // HTML模板替换
            prefix: '##',
            basepath: '@file'
        }))
        .on('error', function(err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(gulp.dest(dist)) // 拷贝
        .pipe(Connect.reload()); // 刷新浏览器
}

// css
async function css() {
    return await gulp.src('src/css/*.less')
        .pipe(Less()) // 编译less
        .pipe(gulp.dest(dist + '/css')) // 拷贝
        .pipe(Connect.reload()); // 刷新
}

// js
async function js() {
    return await gulp.src('src/js/**')
        // .pipe(Jshint()) // 检查代码
        .on('error', function(err) {
            Gutil.log(Gutil.colors.red('[error]'), err.toString())
        })
        .pipe(gulp.dest(dist + '/js')) // 拷贝
        .pipe(Connect.reload()); // 刷新
}

// image
async function image() {
    return await gulp.src('src/images/*')
        .pipe(gulp.dest(dist + '/images')) // 拷贝
        .pipe(Connect.reload()); // 刷新
}

// clean
async function clean() {
    return await gulp.src(dist, {allowEmpty: true})
        .pipe(Clean()); // 删除之前生成的文件
}

// 启动服务器
async function server() {
    Connect.server({
        root: dist, // 根目录
        // ip: '192.168.1.65', // 默认localhost:8080
        livereload: true, // 自动更新
        port: 8090,
        middleware: function(connect, opt) {
            return [
                createProxyMiddleware('/api', {
                    target: 'http://localhost:8080',
                    changeOrigin: true
                }),
                createProxyMiddleware('/idcMonitorServer', {
                    target: 'http://10.0.0.186:18090',
                    changeOrigin: true
                }),
            ]
        }
    })
}

module.exports = {
    html,
    css,
    js,
    image,
    clean,
    server
}
```
## 3. gulp.prod.js文件

```js
// config/gulp.prod.js


const gulp = require('gulp');

const Uglify = require('gulp-uglify'); // 压缩js
const Minifycss = require('gulp-minify-css'); // 压缩css
const Less = require('gulp-less'); // 编译less
const Autoprefixer = require('gulp-autoprefixer'); // 浏览器前缀
const Minifyhtml = require('gulp-minify-html'); // 压缩html
const FileInclude = require('gulp-file-include'); // 文件模块化
const Imagemin = require('gulp-imagemin'); // 压缩图片
const Pngquant = require('imagemin-pngquant'); // png图片压缩
const Cache = require('gulp-cache'); // 压缩图片会占用较长时间，使用此插件可以减少重复压缩
const Clean = require('gulp-clean'); // 清理目录
const rev = require('gulp-rev'); // 为静态文件随机添加一串hash值，解决浏览器缓存问题，防止项目打包上线以后，由于浏览器缓存项目加载不到最新修改的js或者css代码
const revCollector = require('gulp-rev-collector'); // 根据gulp-rev生成的manifest.json文件中的映射，将html中的路径替换

// 获取配置文件
const config = require('./config');
const { dist } = config;

// css
async function css() {
    return await gulp.src('src/css/**')
        .pipe(Less())
        .pipe(Autoprefixer({
            cascade: true, // 添加前缀
            remove: true // 去掉不必要的前缀
        }))
        .pipe(Minifycss({
            advanced: true, // 开启高级优化（合并选择器等）
            compatibility: '', // 保留IE7及以下兼容写法，其值有4种['': 启用兼容模式，'ie7': IE7兼容模式，'ie8': IE8兼容模式， '*': IE9+兼容模式]
            keepBreaks: false, // 是否保留换行
            keepSpecialComments: '*' // 保留所有特殊前缀，当调用Autoprefixer生成css前缀时，如果这里不设置，有可能会删除你的部分前缀
        }))
        // .pipe(gulp.dest(dist + '/css'))
        .pipe(rev())
        .pipe(gulp.dest(dist + '/css'))
        .pipe(rev.manifest()) // CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
        .pipe(gulp.dest('rev/css'));
}

// js
async function js() {
    return await gulp.src('src/js/**')
        .pipe(Uglify()) // 压缩js
        // .pipe(gulp.dest(dist + '/js'))
        .pipe(rev())
        .pipe(gulp.dest(dist + '/js'))
        .pipe(rev.manifest()) // js生成文件hash编码并生成 rev-manifest.json文件名对照映射
        .pipe(gulp.dest('rev/js'));
}
async function html() {
    return gulp.src(['rev/**/*.json', 'src/views/*.html'])
        .pipe(revCollector({ // 利用rev-manifest.json完成html中url的替换
            replaceReved: true,
            dirReplacements: {
                // 'css': 'dist/css', // 将URL中的css替换为css,真实相同则不必写
                // 'js': 'js',
                // '//cdn': function(manifest_value) { // 如果使用了cdn可以这样写
                //     return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                // }
            }
        }))
        .pipe(FileInclude({ // HTML模板替换
            prefix: '##',
            basepath: '@file'
        }))
        .pipe(Minifyhtml())
        .on('error', function(err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(gulp.dest(dist))
}
// image
async function image() {
    return await gulp.src('src/images/*')
        .pipe(Cache(Imagemin({
            optimizationLevel: 5, // 优化等级，默认值3 取值范围：0-7
            progressive: true, // 无损压缩jpg图片
            interlaced: true, // 隔行扫描gif进行渲染
            multipass: true, // 多次优化svg直到完全优化
            svgoPlugins: [{ removeViewBox: false }], // 不要移除svg的viewbox属性
            use: [Pngquant()] // 使用Pngquant插件深度压缩png图片
        })))
        .pipe(gulp.dest(dist + '/images')) // 拷贝
    }

    // clean
    async function clean() {
        return await gulp.src(dist, {allowEmpty: true})
            .pipe(Clean()); // 删除之前生成的文件
    }

    module.exports = {
        css,
        js,
        image,
        html,
        clean
    }
```
## 4. gulpfile.js文件

```js
// gulpfile.js 

const gulp = require('gulp');

// 根据环境引入不同的配置文件
let buildConfig;
if(process.env.NODE_ENV === 'dev') {
    buildConfig = require('./build/gulp.dev');
    gulp.task('server', buildConfig.server); // 起一个本地服务器
} else {
    buildConfig = require('./build/gulp.prod');
    gulp.task('clean', buildConfig.clean); // 清理目录
}

gulp.task('html', buildConfig.html); // 打包html
gulp.task('js', buildConfig.js); // 打包js
gulp.task('css', buildConfig.css); // 打包css
gulp.task('image', buildConfig.image); // 打包iamge
// gulp.task('sources', gulp.series('html', gulp.parallel('js', 'css', 'image')));
gulp.task('sources', gulp.series('js', 'css', 'image', 'html'));
// 监听文件变化
gulp.task('watch', async () => {
    gulp.watch('src/views/*', gulp.series('html')); // 监听html变化
    gulp.watch('src/js/**', gulp.series('js')); // 监听js变化
    gulp.watch('src/css/*', gulp.series('css')); // 监听css变化
    gulp.watch('src/images/*', gulp.series('image')); // 监听image变化
});

if (process.env.NODE_ENV === 'dev') {
    gulp.task('dev', gulp.series('sources', 'server', 'watch'));
} else {
    gulp.task('build', gulp.series('sources'))
}
```
`gulpfile.js`里面有下面一行代码：
```js
// gulp.task('sources', gulp.series('html', gulp.parallel('js', 'css', 'image')));
```
我解释一下，意思是先执行压缩html的命令，再一起执行压缩js，css和image的命令，由于我使用了`gulp-rev`和`gulp-rev-collector`两个插件来给css和js添加md5后缀，需要替换html中css和js的url，所以压缩html的任务应该放到最后面执行，要不然你会发现压缩后的html中的url并没有被替换，命令书写如下：
```js
gulp.task('sources', gulp.series('js', 'css', 'image', 'html'));
```
然后在package.json里面编写npm运行脚本：
```json
  "scripts": {
    "start": "set NODE_ENV=dev&&gulp dev",
    "build": "set NODE_ENV=prod&&gulp clean && gulp build",
    "serve": "http-server dist/static -p 3000"
  },
```
`set NODE_ENV=dev&&gulp dev`表示设置环境变量为dev，并且运行gulp dev命令 其中dev表示开发环境，我们在cmd中执行npm run start 就可以走这条命令

`set NODE_ENV=prod&&gulp clean && gulp build`表示设置环境变量为prod，并且运行gulp clean和gulp build命令，我们在cmd中执行npm run build 就可以走这条命令
> 特别注意：`NODE_ENV=dev&&gulp` `dev`后面不能留空格，这是一个坑，导致我运行npm run start时老是报错，找了好久才发现是这个问题NODE_ENV=dev&&gulp dev，所以一定要记住&&符号一定要和NODE_ENV=dev挨着

为啥要设置环境变量，因为要在gulpfile.js里面判断是开发还是生成环境，然后再执行相应的gulp命令，比如下面的代码：
```js
// 根据环境引入不同的配置文件
let buildConfig;
if(process.env.NODE_ENV === 'dev') {
    buildConfig = require('./build/gulp.dev');
    gulp.task('server', buildConfig.server); // 起一个本地服务器
} else {
    buildConfig = require('./build/gulp.prod');
    gulp.task('clean', buildConfig.clean); // 清理目录
}
```
process.env 它是node的一个方法，它是一个对象，这个对象里存放了当前node命令运行时的环境数据，通过process.env.NODE_ENV就可以拿到set NODE_ENV=dev的结果，所以运行如下命令：
```
npm run start // 启动本地服务，可以愉快的开发项目了

npm run build // 开发完毕，打包你的项目
```

我再说一下，[JS-Web-Skill](https://github.com/darenone/JS-Web-Skill.git)这个项目里，在`views/index.html`里面，引入css的时候，我是这样写的：

```html
<link rel="stylesheet" href="./../css/index.css">
```

但是我的css文件夹下只写了`index.less`文件，并没有这个`index.css`文件，不过不用担心，gulp已经自动给你转换了，因为浏览器编译的html是`dist`文件夹里的html

