# Compose安装

<!--标题：Clash配置｜分类：system｜标签：clash，proxy，代理,翻墙-->

> 本帖总结Clash代理使用的各种问题

---

### RuleSet

这里先留空，有时间补上

### 保证开启系统代理，本地地址不走代理的配置方法

```yaml
  - DOMAIN-SUFFIX,ywf.me,DIRECT
  - DOMAIN-SUFFIX,one.me,DIRECT
  - DOMAIN-SUFFIX,fast.me,DIRECT
  - DOMAIN-SUFFIX,tp.me,DIRECT
  - IP-CIDR,192.168.0.1/24,DIRECT
  - IP-CIDR,192.168.2.1/24,DIRECT
  - IP-CIDR,127.0.0.1/32,DIRECT
```

前面是匹配域名，后面是匹配局域网IP段，这样这些地址就都不会走system代理了





```bash
docker login --username=xhn5****@163.com registry.cn-hangzhou.aliyuncs.com
```

```bash
/bin/tini -- /usr/local/bin/docker-entrypoint.sh eswrapper

wsl -d docker-desktop

sysctl -w vm.max_map_count=262144
```

