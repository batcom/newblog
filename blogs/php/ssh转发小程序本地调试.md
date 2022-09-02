# SSH转发

<!--标题：SSH转发｜分类：php｜标签：ssh，nginx,代理,转发,内网-->

> 本帖总结SSH转发相关问题

---

### 本地转发

```bash
ssh -CfNg -L 13306:platform.mysql.polardb.rds.aliyuncs.com:3306 wote
```

上面的代码的意思是，通过wote这台ssh机器作为跳板，访问本地的13306端口即是访问远程rds的3306端口，其中rds只允许wote这台机器访问，本地无法远程直接访问rds

### 远程转发

```bash
ssh -CfNg -R :7770:127.0.0.1:80 yiwofa
```

上面代码的意思是，访问远程公网机器的7770端口，会自动转发到本地的80端口，通过yiwofa主机。这里可以用到的就是小程序的本地开发调试，因为小程序需要配置`https`访问域名，所以，就需要将远程的路由转发到本地内网的端口，形成映射进而进行调试，具体操作如下

1. 在本地开发机上面运行上面的代码，这样会在远程公网主机上面开一个7770的本地端口，然后利用nginx的proxy_pass来访问这个端口，就自动映射到内网本地开发机器的80端口上面了。

2. 远程主机的nginx这样配置

   ```ng
   location /apis {
                   proxy_pass http://127.0.0.1:7770/;
                   proxy_set_header Host 'backend.ywf.me';
                   proxy_set_header X-Real-IP $remote_addr;
                   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   }
   ```

   **其中一定要注意`proxy_pass`Url后面的`/`一定不能掉**，否则转发会失败，在这坑里浪费不少时间，记得以前也踩过这样的坑，忘记了。这次强调要记住。

   然后 `Host`可以根据需要进行变更，比如你本地nginx的80端口监听的虚拟主机，可以根据这个来进行配置。

   这样做了以后，比如小程序对应的业务公网域名是`www.public.com`，那么小程序里面用`www.public.com/apis/`后面加原来的路径，即可访问到本地对应`backend.ywf.me`这个虚拟主机下面的代码。即如果远程www.public.com/index/index/hello ,用www.public.com/apis/index/index/hello，即可访问相关代码

   如果有多个人进行本地开发调试，动态传递$host变量，然后根据nginx的虚拟主机，指定不同的root，配置一个sftp即可实现多人同一个远程端口转发，即可应对多人进行远程调试。