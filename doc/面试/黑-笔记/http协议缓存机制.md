# http协议缓存机制

## 前言

http缓存的流程：发起流程，判断是否已经缓存，如果是未发现缓存，则向web服务器发送请求，请求响应，缓存协商。如果已经缓存，则看缓存是否过期，如果未过期则从缓存中读取，如果已经过期，则重新向服务器发起验证，验证是否通过，如果未通过就重新向web服务器发送请求，如果验证通过就请求响应，缓存协商。

## http报文组成

1. 包含属性的首部（header）

   附加信息（cookie，缓存信息等）与缓存相关的规则信息，均包含在header中。

   常见的请求头：

   |                           请求头                           |              含义              |
   | :--------------------------------------------------------: | :----------------------------: |
   |                  Accept:text/html,image/*                  |      浏览器可以接收的类型      |
   |                 Accept-Charset:ISO-8869-1                  |    浏览器可以接收的编码类型    |
   |               Accept-Encoding:gzip,compress                |  浏览器可以接收的压缩编码类型  |
   |                Accept-Language:en-us,zh-cn                 | 浏览器可以接收的语言和国家类型 |
   |                     Host:www.lks.cn:80                     |     浏览器请求的主机和端口     |
   |       If-Modified-Since:tue,11 Jul 2000 18:23:51 GMT       |       某个页面的缓存时间       |
   |                 Referer:http:www.baidu.com                 |       请求来自于哪个页面       |
   | User-Agent:Mozilla/4.0 compatibles;MSIE 5.5;windows NT 5.0 |         浏览器相关信息         |
   |                           Cookie                           |   浏览器暂存服务器发送的信息   |
   |             Connection:close1.0/Keep-Alive1.1              |        请求的版本的特点        |
   |             Date:tue,11 Jul 2000 18:23:51 GMT              |         请求网站的时间         |
   |                         Allow:GET                          |         请求的方法GET          |
   |                        Keep-Alive:5                        |         连接的时间：5          |
   |                   Connection:keep-alive                    |          是否是长连接          |
   |                 Cache-Control:max-age=300                  |      缓存的最长时间 300s       |

2. 包含数据的主体部分（body）

   HTTP请求想要真正传输的部分

## http缓存规则

1. 强制缓存

   对于强制缓存来说，header中会有两个字端来标明失效规则（Expires/Cache-Control），指的是当前资源的有效期

   1. Expires

      Expires的值为服务端返回的到期时间，在响应http请求时告诉浏览器在过期时间前浏览器可以直接从浏览器缓存读取数据，而无需再次请求。不过Expires是HTTP1.0的东西，现在默认浏览器均使用HTTP1.1，所以它的作用基本忽略，Expires的一个缺点就是，返回的到期时间是服务器端的时间，这样存在一个问题，比较的时间是客户端本地设置的时间，所以有可能会导致差错，所以在HTTP1.1开始，使用Cache-Control替代

   2. Cache-Control

      用于定义所有的缓存机制都必须遵循的缓存指示，这些指示是一些特定的指定，包括public，private，no-cache（表示可以存储，但在重新验证其有效性之前不能用于响应客户端请求），no-store，max-age，smaxage以及must-revalidate等，Cache-Control中设定的时间会覆盖Expires中指定的时间。

2. 对比缓存

   对比缓存，顾名思义，需要进行比较判断是否可以使用缓存。

   浏览器第一次请求数据时，服务器会将缓存标识与数据一起返回给客户端，客户端将二者备份至缓存数据库中。

   再次请求数据时，客户端将备份的缓存标识发送给服务器，服务器根据缓存标识进行判断，判断成功后，返回304状态码，通知客户端比较成功，可以使用缓存数据。

   在对比缓存生效时，状态码为304，并且报文大小和请求时间大大减少。

   原因是服务端在进行识别比较后，只返回header部分，通过状态码通知客户端使用缓存，不再需要将报文主体部分返回给客户端。

   对于对比缓存来说，缓存标识的传递是我们着重需要理解的，它在请求header和响应header之间传递，一共分为两种标识传递

   1. Last-Modified/If-Modified-Since规则

      Last-Modified:

      ​	服务器在响应请求时，告诉浏览器资源的最后修改时间

      If-Modified-Since:

      ​	再次请求服务器时，通过此字段通知服务器上次请求时，服务器返回的资源最后修改时间。服务器收到请求后发现有头If-Modified-Since则与被请求资源的最后修改时间进行比对，若资源的最后修改时间大于If-Modified-Since，说明资源又被改动过，则响应整片资源内容，返回码200，若资源的最后修改时间小于或者等于If-Modified-Since，说明资源无新修改，则响应HTTP 304，告知浏览器继续使用所保存的cache。

   2. Etag/If-None-Match规则（优先级高于Last-Modified/If-Modified-Since）

      Etag:

      ​	服务器资源的唯一标识符，浏览器可以根据Etag值缓存数据，节省带宽，如果资源已经改变，Etag可以帮助防止同步更新资源的相互覆盖，Etag优先级比Last-Modified高。

      If-None-Match：

      ​	再次请求服务器时，通过此字段通知服务器客户端缓存数据的唯一标识。服务器收到请求后发现有头If-None-Match，则与被请求资源的唯一标识进行比对，不同，说明资源又被改动过，则响应整片资源内容，返回状态码200，相同，说明资源无新修改，则响应HTTP 304，告知浏览器继续使用所保存的cache

为什么已经有了Last-Modified已经能够知道本地缓存是否是最新的了，为什么还需要Etag呢？

主要因为Last-Modified标注的最后修改时间只能精确到秒，如果有些资源在一秒内被多次修改的话，他就不能准确标注文件的新鲜度了，如果某些资源会被定期生成，当内容没有变化，但Last-Modified却改变了，导致文件没使用缓存有可能存在服务器没有准确获取资源修改时间，或者与代理服务器时间不一致的情形。

## 不能被缓存的请求

- 不能被缓存的请求HTTP信息头包含Cache-Control：no-cache,progma:no-cache,或者Cache-Control：max-age=0等告诉浏览器不用缓存的请求。
- 需要根据Cookie，认证信息等决定输入内容的动态请求是不能被缓存的
- 经过https安全加密的请求（有人也经过测试发现，ie其实在头部加入cache-control：max-age信息，firefox在头部加入cache-control：public之后，能够对https的资源进行缓存）
- http响应头不包括Last-Modified/Etag，也不包括Cache-Control/Expires的请求无法被缓存
- 目前浏览器的实现是不会对post请求的响应做缓存的（从语义上来说也不应该），并且规范中也规定了返回状态码不允许是304，不过这并不表示post的响应不能被缓存，如果在post请求对应的响应中包含Freshess相关信息的话，这次响应也是被缓存。