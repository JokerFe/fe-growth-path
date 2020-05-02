# quicklink源码解读

> Faster subsequent page-loads by prefetching in-viewport links during idle time.

## 简介

`quicklink`是由Google开发的一个js库，它的作用是将**资源预加载**，让接下来的网页访问更加的顺畅。

> #### How it works
>
> Quicklink attempts to make navigations to subsequent pages load faster. It:
>
> Quicklink试图使导航到后续页面加载更快
>
> - **Detects links within the viewport** (using [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API))
> - **Waits until the browser is idle** (using [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback))
> - **Checks if the user isn't on a slow connection** (using `navigator.connection.effectiveType`) or has data-saver enabled (using `navigator.connection.saveData`)
> - **Prefetches URLs to the links** (using [`<link rel=prefetch>`](https://www.w3.org/TR/resource-hints/#prefetch) or XHR). Provides some control over the request priority (can switch to `fetch()` if supported).

上面这段话是[quicklink](https://github.com/GoogleChromeLabs/quicklink)在github中的介绍。它介绍了`quicklink`的4个特性，下面逐个介绍这些特性。

### **1. Detects links within the viewport**

通过`Intersection Observer`检测视口内的链接。`Intersection Observer API`提供了一种异步观察目标元素与顶级文档viewport的交集中的变化的方法。

使用方法：

```js
const observer = new IntersectionObserver(callback, option?);

// eg: 用来监听页面内所有的a标签是否出现在视窗内
const observer = new IntersectionObserver(entries=>{
	entries.forEach(entry=>{
  	const link = entry.target;
    console.log(link)                                   
	})
});
Array.from(document.querySelectorAll("a"),link=>{
  observer.observe(link);
}) 
```

具体的使用方法请参考：[Intersection Observer API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)

### **2. Waits until the browser is idle**

等浏览器空闲的时候来做这些操作，不影响用户当前页面的使用体验。它是通过`requestIdleCallback`来实现的。

**`window.requestIdleCallback()`**方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。

```js
var handle = window.requestIdleCallback(callback[, options])
```

具体的使用方法请参考：[requestIdleCallback - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

### **3. Checks if the user isn't on a slow connection**

**检查用户是否在慢速连接上**（使用 `navigator.connection.effectiveType`获取当前网络类型) 或已启用数据保护程序（使用 `navigator.connection.saveData`用户是否在用户代理上设置了减少的数据使用选项)。典型的用流量来换取用户的体验的优化。

具体的使用方法请参考：[navigator.connection.effectiveType -MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Network_Information_API) 与 [NetworkInformation.saveData - MDN](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData)

### **4. Prefetches URLs to the links**

**将URL链接预加载**。通过使用`<link rel=prefetch>`或者`XHR`。提供一些对请求优先级的控制（如果支持，可以切换到`fetch`）。`Resources Hints`包含如下内容：

* **prefetch**
* **preconnect**
* **preload**
* **prerender**

![Resources Hints](https://github.com/Jokul518/fe-growth-path/blob/master/imgs/性能优化/Resources Hints mindnode.png?raw=true)

## 源码解读

quicklink的**加载流程**：

1. 检测网页中的链接是否出现在视口中，等待链接出现在视口，执行步骤2。
2. 等待浏览器空闲后执行3。
3. 判断当前的网络连接是否是2G，如果是则停止执行，如果不是2G网络，执行步骤4。
4. 预加载链接指向资源。

通过它的使用方法找到入口，[点击查看具体使用方法](https://github.com/GoogleChromeLabs/quicklink)。

### 入口函数

如果用户的有效连接类型和数据保护程序首选项表明这将是有用的，则预取一个URL数组。 默认情况下，查看“document”的in-viewport链接。还可以处理提供的DOM元素或静态URL数组。

> 源码路径：/src/index.mjs

```js
/* 参数信息
 * @param {Object} options - Configuration options for quicklink
 * @param {Object} [options.el] - DOM element to prefetch in-viewport links of
 * @param {Boolean} [options.priority] - Attempt higher priority fetch (low or high)
 * @param {Array} [options.origins] - Allowed origins to prefetch (empty allows all)
 * @param {Array|RegExp|Function} [options.ignores] - Custom filter(s) that run after origin checks
 * @param {Number} [options.timeout] - Timeout after which prefetching will occur
 * @param {Number} [options.throttle] - The concurrency limit for prefetching
 * @param {Number} [options.limit] - The total number of prefetches to allow
 * @param {Function} [options.timeoutFn] - Custom timeout function
 * @param {Function} [options.onError] - Error handler for failed `prefetch` requests
 */
export function listen(options) {}

  // 回调函数
 timeoutFn(() => {
    (options.el || document).querySelectorAll('a').forEach(link => {
      if (!allowed.length || allowed.includes(link.hostname)) {
        isIgnored(link, ignores) || observer.observe(link);
      }
    });
  }, {
    timeout: options.timeout || 2000
  });
```

首先进行的是初始化参数，通过`Object.assign`函数合并默认配置和设置的配置。

### 检测link出现在视窗内

`quicklink`通过`observer.observe(link)`监视节点元素，`observer`是`IntersectionObserver`对象的实例，用来监听link出现在视窗内。如果符合条件，调用`prefetch`方法，创建资源链接。

> 源码路径：/src/index.mjs

```js
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry = entry.target);
        // Do not prefetch if will match/exceed limit
        // 如果超过或者匹配限制，则不进行预加载
        if (toPrefetch.size < limit) {
          toAdd(() => {
            prefetch(entry.href, options.priority).then(isDone).catch(err => {
              isDone();
              if (options.onError) options.onError(err);
            });
          });
        }
      }
    });
  });
```

### prefetch函数

使用可选的首选获取优先级预取给定的URL。返回一个`Promise`对象，通过`Promise.all`函数，加载多个link资源。

> 源码路径：/src/index.mjs

```js
/** 参数详情
* @param {String} url - the URL to fetch
* @param {Boolean} [isPriority] - if is "high" priority
* @param {Object} [conn] - navigator.connection (internal)
* @return {Object} a Promise
*/
const toPrefetch = new Set();
export function prefetch(url, isPriority, conn) {
  if (conn = navigator.connection) {
    if (conn.saveData || /2g/.test(conn.effectiveType)) return;
  }
  return Promise.all(
    [].concat(url).map(str => {
      if (!toPrefetch.has(str)) {
        toPrefetch.add(str);
        // 降级处理进行资源预加载
        return (isPriority ? priority : supported)(
          new URL(str, location.href).toString()
        );
      }
    })
  );
}

```

### 异步函数

如果浏览器支持requestIdleCallback，则使用原生的函数，如果不支持，则使用setTimeout函数做ployfill。

> 源码路径：/src/request-idle-callback.mjs

```js
const requestIdleCallback = window.requestIdleCallback ||
  function (cb) {
    const start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

export default requestIdleCallback;
```

### 资源请求

`quicklink`预加载资源的三种策略

> 源码路径：/src/prefetch.mjs

**1. prefetch**

```js
function viaDOM(url) {
  return new Promise((res, rej, link) => {
    link = document.createElement(`link`);
    link.rel = `prefetch`;
    link.href = url;
    link.onload = res;
    link.onerror = rej;
    document.head.appendChild(link);
  });
};
```

**2. XHR**

```js
function viaXHR(url) {
  return new Promise((res, rej, req) => {
    req = new XMLHttpRequest();
    req.open(`GET`, url, req.withCredentials=true);
    req.onload = () => {
      (req.status === 200) ? res() : rej();
    };
    req.send();
  });
}
```

**3. fetch**

```js
export function priority(url) {
  return window.fetch ? fetch(url, {credentials: `include`}) : viaXHR(url);
}
```

进行预加载策略的降级处理

```js
// 判断是否支持prefetch
function hasPrefetch(link) {
  link = document.createElement('link');
  return link.relList && link.relList.supports && 		link.relList.supports('prefetch');
}

export const supported = hasPrefetch() ? viaDOM : viaXHR;
```

## 总结

`quicklink`是前端性能优化的一种手段，使用户后序页面的**第一次访问加快**。它检测页面的滚动，可以**预加载**出现在视窗内的页面链接，预加载下一页的资源，**提高用户体验**。是一种**以用户网络流量来换取体验**的手段。同时，也通过它的源码熟悉前端加载资源的优化方式。**PWA技术是优化用户的二次访问效率和体验**。

