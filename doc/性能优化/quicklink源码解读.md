> Faster subsequent page-loads by prefetching in-viewport links during idle time.

## 简介

`quicklink`是由Google开发的一个js库，它的作用是将**资源预加载**，让接下来的网页访问更加的顺畅，用流量来换取用户的体验。

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

### **Detects links within the viewport**

通过`Intersection Observer`检测视口内的链接.`Intersection Observer API`提供了一种异步观察目标元素与顶级文档viewport的交集中的变化的方法。

### **Waits until the browser is idle**

### **Checks if the user isn't on a slow connection**

### **Prefetches URLs to the links**

**将URL链接预加载**。通过使用`<link rel=prefetch>`或者`XHR`。提供一些对请求优先级的控制（如果支持，可以切换到`fetch`）。`Resources Hints`包含如下内容：

* **prefetch**
* **preconnect**
* **preload**
* **prerender**

![Resources Hints](https://github.com/Jokul518/fe-growth-path/blob/master/imgs/性能优化/Resources Hints mindnode.png?raw=true)

