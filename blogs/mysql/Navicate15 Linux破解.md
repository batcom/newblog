# Navicate15 Linux破解

<!--标题：Navicate15 Linux破解｜分类：mysql｜标签：navicate,msyql,破解 -->

> 　　Linux下面破解Navicate15 ，形成脚本，快速化破解。

### 总体上按照github上面的来

[破解教程](https://github.com/batcom/navicat-keygen-tools)

### 依赖安装

```bash
sudo apt-get install libcapstone-dev cmake rapidjson-dev
git clone https://github.com/keystone-engine/keystone.git
cd keystone
mkdir build
cd build
../make-share.sh
sudo make install
sudo ldconfig
```



```bash
wget -c https://download.navicat.com.cn/download/navicat15-premium-cs.AppImage
mkdir ~/tmp/navicat15-premium-cs
sudo mount -o loop ~/tmp/navicat15-premium-cs.AppImage ~/tmp/navicat15-premium-cs
cp -r ~/tmp/navicat15-premium-cs ~/tmp/navicat15-premium-cs-patched
./navicat-patcher ~/tmp/navicat15-premium-cs-patched  #这步会生成pem文件
./navicat-keygen --text ./RegPrivateKey.pem
```

然后按教程上面进行破解

还有一种可试的快速方法就是去阿里云盘下载对应已经patched的文件，然后直接执行最后一步，里面exec文件夹里面有对应的pem文件，但不知道这个能不能通用

