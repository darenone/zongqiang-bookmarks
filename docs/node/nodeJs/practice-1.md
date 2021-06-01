# 1-介绍
nodeJS是什么？<br>
nodeJS是一个基于Chrome的V8引擎的JavaScript运行环境（它相当于一个平台）

[nodeJs下载](https://nodejs.org/zh-cn/download/)然后直接安装到你的电脑上即可<br>
[nodeJs中文文档](http://nodejs.cn/api/)<br>
[代码练习地址](https://github.com/darenone/NodeJs)<br>
[visual studio code 编辑器](https://code.visualstudio.com/)

<h3 style="color: #FB7477">nvm安装</h3>

[nvm管理工具](https://github.com/nvm-sh/nvm/blob/master/README.md)

为什么需要安装这个nvm管理工具呢？因为在官网下载的nodeJs安装包，在安装时会覆盖掉之前的版本，如果需要在电脑上同时安装不同版本的nodeJs，就需要这个nvm管理工具，此nvm安装不适合windows系统的电脑，如果是苹果电脑可以执行以下代码进行安装
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
如果安装不成功，可以执行以下代码
```
git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```
如果安装成功，在命令行中输入`nvm`有信息打印出来就表示安装成功，如果提示`command not found`，则在命令行输入`touch ~/.bash_profile`表示新建一个bash_profile文件，然后在苹果电脑小房子那个地方，执行快捷键`command + shift + .`显示隐藏的文件夹,找到这个新建的bash_profile文件，打开它，将下列代码复制到此文件内保存(也可以在[nvm管理工具](https://github.com/nvm-sh/nvm/blob/master/README.md)找到这行代码)，然后重启命令行工具，输入`nvm`就可以了
```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
<h4>常用nvm命令</h4>

```
- nvm ls-remote                查看node存在的所有的版本
- nvm install node版本号        安装对应的node版本
- nvm use node版本号            使用指定node版本，然后使用node -v 查看是否切换成功
- nvm uninstall node版本号      删除已安装的指定版本
- nvm ls                       列出所有安装的版本
```
以上是苹果电脑下使用nvm

在windows电脑下使用nvm可从这里下载[nvm-windows](https://github.com/coreybutler/nvm-windows/releases)在这个页面找到`nvm-setup.zip`，把它下载下来，它是一个安装软件，然后解压点击next进行傻瓜式安装即可，提示一下，这些开发用到的软件，最好都安装到c盘系统盘，保持`C:\Program Files\nvm`和`C:\Program Files\nodejs`一致，安装完成，命令行输入`nvm`出现下面结果就证明安装成功
```
Running version 1.1.7.

Usage:

  nvm arch                     : Show if node is running in 32 or 64 bit mode.
  nvm install <version> [arch] : The version can be a node.js version or "latest" for the latest stable version.
                                 Optionally specify whether to install the 32 or 64 bit version (defaults to system arch).
                                 Set [arch] to "all" to install 32 AND 64 bit versions.
                                 Add --insecure to the end of this command to bypass SSL validation of the remote 
......
```