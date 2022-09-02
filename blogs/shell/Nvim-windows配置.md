# Nvim-windows 配置

<!--标题：Nvim-windows 配置｜分类：shell｜标签：Windows,vim,nvim -->

> windows下面nvim倒腾的记录

---

## 总结

### 下载Nvim 

地址`https://github.com/neovim/neovim/releases` 直接下载64位的，解压.

克隆Nvim配置 `git clone git@github.com:batcom/nvim.git` ,建立配置文件目录

```bash
mkdir -p ~/AppData/Local/nvim    # 参看https://github.com/neovim/neovim/issues/3700 windows下的配置文件在这里
cp -r nvim/* ~/AppData/Local/nvim 
mv .\init_win.vim .\init.vim # 更改为windows对应的配置
```

将`nvim.exe`添加到可执行环境变量.

然后打开nvim 会出现很多错误，多次按空格跳过，进入主界面，执行`:checkhealth` 解决问题即可

### 配置豆瓣源

```bash
mkdir -p %APPDATA%/pip
touch %APPDATA%/pip/pip.ini
echo <<<EOF
[global]
index-url = http://pypi.douban.com/simple #豆瓣源，可以换成其他的源
trusted-host = pypi.douban.com            #添加豆瓣源为可信主机，要不然可能报错
disable-pip-version-check = true          #取消pip版本检查，排除每次都报最新的pip
timeout = 120
EOF > %APPDATA%/pip/pip.ini
```

### 安装pyenv-win

安装步骤以及环境变量看[pyenv-win](https://github.com/pyenv-win/pyenv-win)很详细

```bash
pip install pyenv-win --target $HOME\\.pyenv
pyenv install -l # 查看可安装的版本
pyenv versions # 查看已经安装的版本
pyenv global 版本号 # 设置全局版本号
```



### 安装pynvim neovim  (python2)

这里如果是Python的话，终端执行下面命令的时候会出现[LookupError: unknown encoding: cp65001](https://stackoverflow.com/questions/35176270/python-2-7-lookuperror-unknown-encoding-cp65001)的错误提示，可以按照链接来解决，简单来说就是设置一个环境变量`PYTHONIOENCODING = "UTF-8"`

```bash
pip install pynvim neovim 
```

### 安装python3 pynvim

如果已经安装号pyenv-win 就很简单了

```bash
pip3 install pynvim 
npm install -g neovim
```

## 安装neovim

安装完上述依赖后就需要安装`vim-plug`, 实践的时候出现了`Unknown function: plug#begin`的错误，后来是直接看的官网github安装方法才成功。看来出了问题，还是优先去查[官方文档](https://github.com/junegunn/vim-plug)啦。

```powershell
iwr -useb https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim |`
    ni "$(@($env:XDG_DATA_HOME, $env:LOCALAPPDATA)[$null -eq $env:XDG_DATA_HOME])/nvim-data/site/autoload/plug.vim" -Force
```

安装这个完成后进入执行PlugInstall 后可能会出现coc.nvim index not found的错误，这可能是因为init.vim中用yarn的缘故多的那一段,删除`~/.config/nvim/plugged/coc.nvim`，用官方给的`Plug 'neoclide/coc.nvim', {'branch': 'release'}`再次`PlugInstall` 即可解决，所以，还是优先看官方文档.

其它fzf,bat,ctag，直接去百度soft/bin下载，添加环境变量即可，至此已经可以使用，不会报错，基本环境已经搭建完成。下面记述以后出现的问题和解决方案.

## 问题集锦

1. 

