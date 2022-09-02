# Clash配置

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


### Parse方案
最新版可以通过配置Parse解决局域网ip

![](https://cdn.jsdelivr.net/gh/batcom/newblog/img/1662086554903.png)

然后编辑填入

```yaml
parsers: # array
    - url: https://fast.losadhwselfff2332dasd.xyz/link/utX6yyqi9C3naiZS?clash=1 ##这里是订阅地址
      yaml:
        prepend-rules:
          - DOMAIN-SUFFIX,github.com,🔰国外流量
          - IP-CIDR,192.168.1.1/24,DIRECT,no-resolve
          - IP-CIDR,192.168.0.1/24,DIRECT,no-resolve
          - IP-CIDR,192.168.2.1/24,DIRECT,no-resolve
          - IP-CIDR,192.168.3.1/24,DIRECT,no-resolve
          - DOMAIN-SUFFIX,ywf.me,DIRECT
          - DOMAIN-SUFFIX,test.me,DIRECT
          - DOMAIN-SUFFIX,tp.me,DIRECT
          - DOMAIN-SUFFIX,ns.me,DIRECT
          - DOMAIN-SUFFIX,mj.me,DIRECT
          - DOMAIN-SUFFIX,ywf.dev,DIRECT
          - DOMAIN-SUFFIX,one.me,DIRECT
          - DOMAIN-SUFFIX,wt.me,DIRECT
```

