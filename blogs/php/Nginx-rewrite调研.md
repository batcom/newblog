# Nginx-rewrite调研

<!--标题：Nginx-rewrite调研｜分类：php｜标签：nginx，rewrite-->

> Nginx配合php的时候，经常容易出现转发配置不正常的问题，比如fastadmin后台配置找不到模块，这个好了，默认tp的坏了，还有laravel,yii等不同的环境，本篇给出通用的，并尽量抽时间解释底层，今天只做结果记录

---

## 最终结果

1. `nginx localtion` 配置

```nginx
location / {
        try_files $uri $uri/ /index.php$uri$is_args$query_string;
        # try_files $uri $uri/ /index.php$uri$is_args$args;
        # if (!-e $request_filename) {
        #     rewrite  ^(.*)$  /index.php?s=/$1  last;
        # }
    }
location ~ \.php(/|$) {
        fastcgi_pass   php:9000;
        include        fastcgi-php.conf;
        include        fastcgi_params;
    }
```

上诉两个Try files等同 也就是 $query_string=$args;

后面那个网上超的默认if语句是不能够通用的，不建议使用，fastadmin和laravel,yii都会出问题

第二个location后面的**(/|$)一定不能掉** 否则会出问题

两条include的顺序不能错，否则容易出问题 

其中`fastcgi-php.conf`内容为

```nginx

# regex to split $uri to $fastcgi_script_name and $fastcgi_path
fastcgi_split_path_info ^(.+?\.php)(/.*)$;

# Check that the PHP script exists before passing it
try_files $fastcgi_script_name =404;

# Bypass the fact that try_files resets $fastcgi_path_info
# see: http://trac.nginx.org/nginx/ticket/321
set $path_info $fastcgi_path_info;
fastcgi_param PATH_INFO $path_info;
fastcgi_read_timeout 3600;

fastcgi_index index.php;

```

`fastcgi_params`内容为

```nginx

fastcgi_param  SCRIPT_FILENAME    $document_root$fastcgi_script_name;
fastcgi_param  QUERY_STRING       $query_string;
fastcgi_param  REQUEST_METHOD     $request_method;
fastcgi_param  CONTENT_TYPE       $content_type;
fastcgi_param  CONTENT_LENGTH     $content_length;

fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
fastcgi_param  REQUEST_URI        $request_uri;
fastcgi_param  DOCUMENT_URI       $document_uri;
fastcgi_param  DOCUMENT_ROOT      $document_root;
fastcgi_param  SERVER_PROTOCOL    $server_protocol;
fastcgi_param  REQUEST_SCHEME     $scheme;
fastcgi_param  HTTPS              $https if_not_empty;

fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;

fastcgi_param  REMOTE_ADDR        $remote_addr;
fastcgi_param  REMOTE_PORT        $remote_port;
fastcgi_param  SERVER_ADDR        $server_addr;
fastcgi_param  SERVER_PORT        $server_port;
fastcgi_param  SERVER_NAME        $server_name;

# PHP only, required if PHP was built with --enable-force-cgi-redirect
fastcgi_param  REDIRECT_STATUS    200;

```

另外附一个各种测试的nginx配置研究示例

```nginx

server {
    listen       80;
    listen 443 ssl;
    server_name  fast.me;
    root   /git/fastadmin/public;
    index  index.php index.html index.htm;
    ssl_certificate /ssl/device.crt;
    ssl_certificate_key /ssl/device.key;
    access_log /dev/null;
    #access_log  /var/log/nginx/nginx.yz.access.log  main;
    error_log  /var/log/nginx/nginx.ywf.error.log;
    error_page   500 502 503 504  /50x.html;
    location / {
        # return 405;
        # try_files $uri $uri/ /index.php$uri;
        # try_files $uri $uri/ /index.php$is_args$args;
        # $request_file :$document_root$uri
        if (!-e $request_filename) {
            # rewrite  ^(.+\.php)(/.+)$  /$1?s=/$2  last;
            # rewrite  ^(.*)$  /index.php?s=/$1  last;
            rewrite ^(.*)$ /index.php/$1 last;
            break;
        }
	}

    # location ~ \.php(/|$) {
    #     fastcgi_index index.php;
    #     fastcgi_split_path_info ^(.+?\.php)(.*)$;   
    #     set $path_info $fastcgi_path_info;
    #     fastcgi_param PATH_INFO       $path_info;
    #     try_files $fastcgi_script_name =404;
    #     fastcgi_pass php:9000;
    #     include fastcgi_params;
        
    # }

    location ~ \.php(/|$) {
        fastcgi_pass php:9000;
        include fastcgi-php.conf;
        include fastcgi_params;
    }
    # location ~ \.php$ {
    #     fastcgi_split_path_info ^(.+\.php)(/.+)$;
    #     fastcgi_pass php:9000;
    #     fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    #     include fastcgi_params;
    # }
    # location ~ \.php {
    #     # return 404;
    #     fastcgi_pass   php:9000;
        
    #     fastcgi_split_path_info ^(.+\.php)(/.+)$;
    #     # try_files $fastcgi_script_name =404;
    #     # set $path_info $fastcgi_path_info;
    #     # fastcgi_param PATH_INFO $path_info;
        
        
    #     # include        fastcgi-php.conf;
    #     include        fastcgi_params;
        
    # }
}
```

