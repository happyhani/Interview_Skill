# nginx基本使用
===============

下载安装nginx
配置nginx.conf文件
在 D:\。。。\nginx-1.10.1目录下cmd

nginx -v：查看Nginx的版本号

nginx -t ： 不运行，而仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件。

nginx -V： 显示 nginx 的版本，编译器版本和配置参数。

start nginx： 启动Nginx

nginx -s stop：快速停止或关闭Nginx

nginx -s quit：正常停止或关闭Nginx

nginx -s reload：配置文件修改重装载命令

查看windows任务管理器下Nginx的进程命令：tasklist /fi "imagename eq nginx.exe"
![Image text](img/nginx.jpg)


> nginx.conf文件配置参考：

    #user  nobody;
    worker_processes  1;

    #error_log  logs/error.log;
    #error_log  logs/error.log  notice;
    #error_log  logs/error.log  info;

    #pid        logs/nginx.pid;


    events {
        worker_connections  1024;
    }


    http {
        include       mime.types;
        default_type  application/octet-stream;

        #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
        #                  '$status $body_bytes_sent "$http_referer" '
        #                  '"$http_user_agent" "$http_x_forwarded_for"';

        #access_log  logs/access.log  main;

        sendfile        on;
        #tcp_nopush     on;

        #keepalive_timeout  0;
        keepalive_timeout  65;

        #gzip  on;
      
      #web scada
      server {
            listen       8080;                 # 直接打开 localhost:8080 端口自己定
            server_name  localhost;
        
        location ^~/scada/{
          set             $prerender 'http://192.168.66.345:4567'; # 代理的地址
          proxy_pass      $prerender;
        }
        location / {
                root    "D:/。。。/webscada";                       # 本地项目地址
                index   index.html index.htm; 
            }
      }
    }

--------------------------------

> 查看nginx访问日志 access_log 

    127.0.0.1 - - [29/May/2018:09:43:17 +0800] "GET / HTTP/1.1" 304 0 "-" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36"

    127.0.0.1 - - [29/May/2018:09:43:18 +0800] "GET /scada/projects HTTP/1.1" 200 1278 "http://localhost:280/" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36"

1. 127.0.0.1 : 
$remote_addr : 客户端（用户）IP地址 

2. [29/May/2018:09:43:17 +0800]: 
$time_local : 访问时间

3. "GET /scada/projects HTTP/1.1"  :
$request: get请求的url地址（目标url地址）的host

4. 200:
$status: 请求状态（状态码，200表示成功，404表示页面不存在，301表示永久重定向等，304表示缓存）

5. 1278 :
$body_bytes_sent ：请求页面大小，默认为B（byte

6. "http://localhost:280/" :
$http_referer : 来源页面，即从哪个页面转到本页，专业名称叫做“referer”

7. "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36":
$http_user_agent: 用户浏览器其他信息，浏览器版本、浏览器类型

8. 最后可能会有 "140.205.201.12" :
$http_x_forwarded_for": 简称XFF头，它代表客户端，也就是HTTP的请求端真实的IP，只有在通过了HTTP 代理或者负载均衡服务器时才会添加该项。它不是RFC中定义的标准请求头信息，在squid缓存代理服务器开发文档中可以找到该项的详细介绍。
标准格式如下：
X-Forwarded-For: client1, proxy1, proxy2
从标准格式可以看出，X-Forwarded-For头信息可以有多个，中间用逗号分隔，第一项为真实的客户端ip，剩下的就是曾经经过的代理或负载均衡的ip地址，经过几个就会出现几个。

当用户请求经过CDN后到达Nginx负载均衡服务器时，其X-Forwarded-For头信息应该为 客户端IP,CDN的IP ，但实际情况并非如此，一般情况下CDN服务商为了自身安全考虑会将这个信息做些改动，只保留客户端IP。我们可以通过程序获得X-Forwarded-For信息或者通过Nginx的add header方法来设置返回头来查看。

--------------------------------


> nginx 主进程号pid 在logs/nginx.pid中

nginx.pid文件在刚安装的时候就是没有，其实在启动 nginx 时自动生成的 里面存放的是 当前 nginx 主进程的 ID 号。nginx的结束重启一般是通过下面命令来实现的：kill -QUIT 26000 其中26000是nginx的主进程号

> linux 的ps

  ps命令最常用的还是用于监控后台进程的工作情况,因为后台进程是不和屏幕键盘这些标准输入/输出设备进行通信的,所以如果需要检测其情况,便可以使用ps命令了.
  ` ps -ef | grep 'nginx' `

  ps -ef | grep详解:
  * PS是LINUX下最常用的也是非常强大的进程查看命令
  * 中间的|是管道命令 是指ps命令与grep同时执行
  * grep全称是Global Regular Expression Print，表示全局正则表达式版本，它的使用权限是所有用户。grep命令是查找，是一种强大的文本搜索工具，
  * -ef是两个参数的合并写法
  * -e 显示所有进程。
  * -f 全格式。
  * 以下这条命令是检查java 进程是否存在：ps -ef |grep java