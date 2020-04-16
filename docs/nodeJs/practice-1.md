### 介绍
nodeJS是什么？<br>
nodeJS是一个基于Chrome的V8引擎的JavaScript运行环境（它相当于一个平台）

[nodeJs下载](https://nodejs.org/zh-cn/download/)然后直接安装到你的电脑上即可<br>
[nvm管理工具](https://github.com/nvm-sh/nvm/blob/master/README.md)为什么需要安装这个nvm管理工具呢？因为在官网下载的nodeJs安装包，在安装时会覆盖掉之前的版本，如果需要在电脑上同时安装不同版本的nodeJs，就需要这个nvm管理工具，此nvm安装不适合windows系统的电脑，如果是苹果电脑可以执行以下代码进行安装
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
如果安装不成功，再执行以下代码
```
git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```