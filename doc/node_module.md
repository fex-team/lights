## Node 包管理使用文档

----

### 背景介绍

基于Node的前后端开发中，如何简单便捷的进行包管理是一个基础的问题。现有的方案存在一定弊端，使用起来较为麻烦。详细的说明见此[调研文档](https://github.com/wangcheng714/doc/blob/master/node-modules.md)。

Lights提供的包管理功能不仅能够通过简单命令就完成一系列操作，同时提供了私有仓库供产品线维护私有资源。

### 开始使用

1 使用npm安装Lights (注意已安装的请更新至0.0.86及以上版本)。`npm install -g lights`

2 开发阶段使用`lights pack` 打包资源

在项目根目录使用此命令将生成两个文件，如下所示：

```bash
|---project //项目根目录
|     |---modules.zip //精简压缩后的node_modules
|     |---npm-shrinkwrap.json //各个包的版本json
```

将这两个文件添加到svn中进行管理，注意**node_modules文件夹不放入到svn中**。

3 编译阶段使用`lights build` 重新编译生成node_modules

在编译阶段项目根目录执行`lights build` 命令就可以按照开发阶段的包版本和当前系统环境重新编译生成node_modules包文件。

### 私有包管理

私有包管理主要解决不方便将资源发布到npm的情况。

**发布私有包**

发布私有包请首先配置lights的私有仓库地址。执行`lights config set repos private` 即可完成设置。您也可以将`private` 替换成自己的lights仓库，如 http://xxx.baidu.com 等(注意后面不要带/)。

如果想将仓库切换成公有仓库，使用`lights config set repos public` 即可。公有仓库的地址是http://lightjs.duapp.com 

配置好之后按照lights的使用方法发布即可。一般执行`lights publish` 即可完成发布。

**使用私有包**

npm默认支持从第三方获取私有资源，所以使用时只需要在package.json中配置依赖包私有地址即可。如下所示：

```javascript
"dependencies": {
    "modjs" : "http://fedev.baidu.com:8889/repos/download?component=modjs&version=1.0.3"
  }
```

注意component为包名称，version为包版本。推荐**私有包不写版本**，这样每次获取最新版本安装。

### 更新包版本

**更新公有包**

使用`npm-outdated` 可以查看npm过期的包，选择需要更新的包修改package.json配置。然后执行`npm install --no-shrinkwrap` 便可以忽略当前版本配置安装指定版本。

**更新私有包**

如果私有包地址写了version参数，修改相应版本即可。对于私有包建议地址中不写version版本，这样每次安装最新版本。


### 常见问题

 1 执行lights pack报错`npm shrinkwrap error！`

> npm shrinkwrap命令将根据package.json和包文件夹生成所有node模块的版本json，如果**有node包未添加到package.json中就会报错**，请注意排查。

2 私有仓库百度外部是否可以访问？

>私有仓库默认不对外，如在家请连接vpn后再访问

3 如何发布到私有仓库？

> 关于lights的基础使用请查看使用文档。模块的package.json配置跟npm相同，使用lights publish即可发布。

4 找不到私有资源？

> 请注意发布的资源是否发布到lights对外的公有仓库去了。使用`lights config get repos` 可查看当前仓库地址。私有仓库地址是http://fedev.baidu.com:8889

5 更新包资源失败？

> npm默认会优先按照npm-shrinkwrap.json中的版本进行安装，如果想更新包，请执行`npm install --no-shrinkwrap` 忽略当前版本配置。

### 联系我们

使用问题及需求欢迎联系！

邮件组：oak@baidu.com

联系人：张涛(zhangtao07)、王程(wangcheng)
