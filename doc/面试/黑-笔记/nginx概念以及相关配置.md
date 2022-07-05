# nginx概念以及相关配置

## nginx相关概念

- **nginx基本概念**

  nginx是一个高性能的HTTP和反向代理服务器，特点是占有内存小，并发能力强，事实上nginx的并发能力确实在同类型的网页服务器中表现较好。nginx转为性能优化而开发，性能是其最重要的考量，表现上非常注重效率，能经受高负载的考验，有报告表明能支持高达50000个并发连接数。

- **正向代理**

  如果把局域网外的internet想象成一个巨大的资源库，则局域网中的客户端要访问internet则需要通过代理服务器来访问，这种代理服务就称为正向代理

- **反向代理**

  其实客户端对代理是无感知的，因为客户端不需要任何配置就可以访问，我们只需要将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据后，再返回给客户端，此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏了真实服务器IP地址

- **负载均衡**

  单个服务器解决不了，我们增加服务器的数量，然后将请求分发到各个服务器上，将原先请求集中到单个服务器上的请求改为请求分发到多个服务器上，将负载分发到不同的服务器，也就是所谓的负载均衡。

- **动静分离**

  为了加快网站的解析速度，可以将动态页面和静态页面由不同的服务器来解析，加快解析速度，降低原来单个服务器的压力。

## nginx安装（Ubuntu为例）

```c
安装
sudo apt-get install nginx
启动
sudo systemctl start nginx
开机自动启动nginx服务
sudo systemctl enable nginx
关闭开机启动nginx服务
sudo systemctl disable nginx
测试命令
sudo nginx -t
查看端口
sudo lsof -i:80
常用到的两个主目录：
/etc/nginx, /var/log/nginx.
/etc/nginx, Nginx 配置目录
drwxr-xr-x conf.d/	# 包含一般性的配置文件， 里面默认没有东西...
-rw-r--r-- fastcgi.conf	# fastcgi 的配置
-rw-r--r-- fastcgi_params	# fastcgi 参数的配置
-rw-r--r-- koi-utf
-rw-r--r-- koi-win
-rw-r--r-- mime.types	# 资源的媒体类型相关配置
drwxr-xr-x modules-available/ # 模块区
drwxr-xr-x modules-enabled/
-rw-r--r-- nginx.conf	# nginx 主配置文件
-rw-r--r-- proxy_params
-rw-r--r-- scgi_params
drwxr-xr-x sites-available/	# 虚拟主机配置文件夹
drwxr-xr-x sites-enabled/	# 虚拟主机配置文件夹， 生效区
drwxr-xr-x snippets/
-rw-r--r-- uwsgi_params
-rw-r--r-- win-utf
其他的都默认不动就好了， 主要有三个地方， nginx.conf	，sites-available/， sites-enabled/
```

## nginx配置文件

nginx配置文件有三部分组成

1. 全局块

   从配置文件开始到events块之间的内容，主要会设置一些影响nginx服务器整体运行的配置指令，主要包括配置运行nginx服务器的用户(组),允许生成的worker process数，进程PID存放路径，日志存放路径和类型以及配置文件的引入等。

2. events块

   events块涉及的指令主要影响nginx服务器和用户的网络连接，常用的设置包括是否开启对多work process下的网络连接进行序列化， 是否允许同时接受多个网络连接，选取哪种事件驱动模型来处理连接请求，每个wok process可以同时支持的最大连接数等。

3. http块

   这算是nginx服务器配置中最频繁的部分，代理，缓存和日志定义等绝大多数功能和第三方模块的配置都在这里，需要注意的是，http块也可以包括http全局块，server块。

   1. http全局块

      http全局块配置的指令包括文件引入，MIME-TYPE定义，日志自定义，连接超时时间，单链接请求数上限等。

   2. server块

      这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，该技术的产生是为了节省互联网服务器硬件成本。每个http块可以包括多个server块，而每个server块就相当于一个虚拟主机，而每个server块也可分为全局server块，以及可以同时包含多个location块，全局server块最常见的配置是本虚拟机主机的监听配置和本虚拟主机的名称或ip配置。

## 配置反向代理

实例一

1. 实现效果

   打开浏览器，在浏览器地址输入地址www.123.com，跳转linux系统tomcat主页面中

2. 准备工作
   1. 在linux系统中安装tomact，使用默认端口
   2. 更改windows中host文件，更改www.123.com的ip映射
   3. 在nginx进行请求转发的配置(反向代理)

3. 具体配置

```
server {
    listen 80;
    server_name 192.158.17.129;
    location / {
        root html;
        proxy_pass http://127.0.0.1:8080;
        index index.html index.htm;
    }
}
```

实例二

1. 实现效果

   使用nginx做反向代理，根据访问的路径跳转到不同端口的服务中，nginx监听端口为9001

   例如：

   访问192.158.17.129:9001/edu/ 直接跳到127.0.0.1:8080

   访问192.158.17.129:9001/vod/ 直接跳到127.0.0.1:8081

2. 准备工作

   1. 准备两个tomcat服务器，一个8080端口，一个8081端口。
   2. 创建文件夹和测试页面

3. 具体配置

```
server {
    listen 9001;
    server_name 192.158.17.129;
    location ~ /edu/ {
        proxy_pass http://127.0.0.1:8080;
    }
    location ~ /vod/ {
        proxy_pass http://127.0.0.1:8081;
    }    
    location [ = | ~ | ~* | ^~ ] uri {
    }
}
<!--
1.=:用于不含正则表达式的uri前，要求请求字符串与uri严格匹配，如果匹配成功，就停止向下搜索并立即处理该请求。
2.~:用于表示uri包含正则表达式，并且区分大小写
3.~*:用于表示uri包含正则表达式,并且不区分大小写
4.^~:用于不含正则表达式的uri前，要求nginx服务器找到标识uri和请求字符串匹配度最高的locaiton后，立即使用此location处理请求，而不再使用location块中的正则uri和请求字符串做匹配
注意:如果uri包含正则表达式，则必然要有~或者~*标识。
 -->
```

## 配置负载均衡

1. 实现效果

   通过浏览器地址栏输入地址 http://192.168.17.129/deu/a.html 负载均衡效果，平均8080和8081端口中

2. 准备工作

   1. 准备两台tomcat服务器，一台8080，一台8081
   2. 在两台tomcat里面webapps目录中，创建名称是edu文件夹，在edu文件夹中创建页面a.html,用于测试

3. 具体配置

```
http{
    upstream myserver {
        server 192.168.17.129:8080;
        server 192.168.17.129:8081;
    }
    server {
        listen:80;
        server_name:192.168.17.129;
        location / {
            proxy_pass http://nyserver;
            proxy_connect_timeout 10;
        }
    }
}
```

nginx提供了集中分配方式（策略）

1. 轮询（默认）

每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除

2. weight

weight代表权重，默认为1，权重越高被分配的客户端越多，指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。

3. ip_hash

每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题。

4. fair(第三方)

按后端服务器的响应时间来分配请求，响应时间短的优先分配。

## 配置高可用

配置高可用的集群

1. 需要两台nginx服务器
2. 需要keepalived
3. 需要虚拟ip

## 配置动静分离

1. 什么是动静分离

   简单说就是把动态跟静态请求分开，不能理解成是单纯的把静态页面和动态页面物理分离，严格意义上说应该是动态请求跟静态请求分开，可以理解为使用nginx处理静态页面，tomcat处理动态页面。

2. 准备工作

   在linux系统中准备静态资源，用于进行访问

3. 具体配置

```
server {
        listen:80;
        server_name:192.168.17.129;
        location /www/ {
            root /data/;
            index index.html index.htm;
        }
        location /image/ {
            root /data/;
            autoindex on;
        }
    }
```

