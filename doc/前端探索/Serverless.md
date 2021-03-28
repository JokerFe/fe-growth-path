# 两个问题

#### Serverless能解决什么问题？ 

从字面上来看就是 server less的意思，少服务或者轻服务的概念，比较准确的就是 是应用开发不需要关心服务器的部署和配置。

#### Serverless为什么难定义？

它是将服务端运维高度抽象成一种解决方案，越抽象越难定义，包含的信息就越大。因为2014年亚马逊推出了第一款真正意义上的Faas服务Lambda，才让serverless进入大多数人的视野，导致很多人以为serverless就等于FaaS。

从架构角度理解，serverless = FaaS + Trigger（事件驱动）+ BaaS = Serverless Computing（无服务器计算）

![serverless-1](/Users/guohaohao3/Documents/Joker/Git/fe-growth-path/imgs/serverless/serverless-1.png)

# 优势

#### 专注业务，快速迭代

无需关心服务器是否在工作、应用是否正常运行，这是serverless的一个特性，这是它的一个大优势。给开发者带来了开发优势和体验优势。一键部署，提高了开发效率，降低人力成本。降低人力成本、降低风险、减少资源开销、增加缩放灵活性、缩短创新周期等。

#### 服务器利用率

根据《福布斯》杂志的统计，企业数据中心的典型服务器使用率仅有5%~15%，这是服务器资源的巨大浪费。在Serverless架构下，无需关心服务器的性能和使用，它是自动伸缩的，业务高峰时自动扩容，业务降低时自动收缩，降低资源浪费。

#### 节省维护和运维成本

无需在业务上线前预估资源，也无需单独配置服务器资源，Serverless会根据实际请求数量进行自动扩容。在空闲情况下，凭借短时间内完成的冷启动优势，serverless可以缩容的极致是0，即无任何计算消耗。

#### 降低风险

项目的组件、架构越复杂、庞大的系统，出现故障的风险就越大。在Serverless架构下，将系统分为不同模块进行独立管理，例如存储、api网关、路由等（有些类似于微前端的概念）。

# 缺点

#### 状态管理能力弱

主要针对FaaS，为了保证可以自动扩缩容，FaaS应用必须是无状态的。有状态的服务就要考虑数据的存储，需要BaaS的支持。

#### 调试困难

本地环境和云环境始终是有区别的，有些报错信息只能在云环境下查看，而且某些问题不太容易定位是本地环境还是云环境产生的。

#### 延迟

因为serverless云函数是冷启动，而且它的应用程序是高度分布式和低耦合的，这就意味着延迟是一个很大的问题，我们可以通过专有的网络协议、RPC调用、数据格式来优化，或者将实例放在同一个机架内或同一个主机实例上来较少延迟。

# 构建流程

Serverless架构是一种全新的软件架构方式，虽然其有各种各样独有的特点，但是Serverless应用和传统的软件应用一样，软件的设计、开发到交付需要经历一个完整的软件生命周期，需要通过具体的手段保证应用的交付质量。敏捷开发拥抱变化、持续改进以及快速迭代的思想在Serverless应用开发的过程中将仍然适用。Serverless应用的交付质量将受益于敏捷开发所使用的具体工具和方法，如结对编程（Pair Programing）、测试驱动开发（Test-driven Development，TDD）以及持续集成与交付（CICD）等。

#### 开发调试

Serverless应用的运行环境在远端Serverless云平台上，开发人员的本地开发环境中并没有Serverless应用运行所需要的环境。因此，默认情况下应用调试需要连接远端环境进行远程调试。但是，目前大部分的开发人员还是习惯在本地进行代码开发和调试。为了提高开发调试的效率，一些Serverless平台提供了本地开发调试环境，如AWS SAM Local和Azure Functions Core Tools。

#### 单元测试

为了保证交付质量，测试是软件开发中必不可少的环节。无论你选择用哪一种语言进行Serverless应用的开发，在编写代码的同时也应该编写与之对应的单元测试（Unit Test）用例。通过单元测试使得Serverless应用的函数逻辑有检验的标准，便于日后应用的维护。Serverless应用的单元测试可以是不依赖于远端云服务的本地测试用例，也可以是依赖于实际使用的云服务的测试用例。对本地测试用例而言，可以通过模拟的方式满足测试输入和依赖的要求。

#### 持续集成

如果我们所开发的软件出现了问题，最好的情况是尽可能早地发现这个问题，并予以修复。这样将最大程度地降低风险和节省成本。通过持续集成，更频繁地将应用的各个模块进行完整部署并测试，更早、更快地发现和修复问题，提升最终的交付质量。持续集成不仅仅适用于传统的应用，也适用于Serverless应用。你可以使用你所熟悉的持续集成工具（如Jenkins）对Serverless应用进行持续集成，也可以尝试一些专门针对Serverless应用量身定制的持续集成工具，如LambCI或Microsoft VSTS。持续集成的流程中往往包含单元测试和集成测试的执行。本地调试环境使得Serverless应用可以在本地被执行和测试。但值得注意的是，虽然本地调试环境可以非常接近于实际的云运行环境，但是实际上两者不可避免地存在着各种差异，因此建议应用测试用例中应该包含运行在实际Serverless云平台上的测试场景。

#### 应用部署

Serverless应用无须部署到具体的主机之上。一般而言，用户可以通过平台所提供的部署工具进行部署。对于同时使用多种不同Serverless平台服务的用户，可以通过如Serverless Framework等工具简化部署的复杂度，实现多平台的统一部署。由于Serverless应用的部署无须对具体主机进行任何操作，因此Serverless应用的部署效率将会更高，更易于实现自动化部署和持续部署。 Serverless应用是否需要实现持续部署，这往往不仅是一个技术问题，还涉及开发团队的文化、管理风格和业务目标优先级。

# 冷启动

#### 定义

在Serverless Computing世界中，函数是按需运行的，如果没有请求，就不会有函数实例占用函数服务资源。从调用函数开始到函数实例准备完成的整个过程，被称为**冷启动**。冷启动代表着代码首次执行时所消耗的时长。这意味着相关代码需要进行下载、启动容器、启动及运行准备。

#### 四个阶段

1. 下载代码： FaaS平台不会存储代码，这也是为了能够缩容到 0 。代码实际上会被存储在服务中，在冷启动过程中会从存储服务中下载代码。
2. 启动容器：代码下载完后，FaaS会根据函数的配置，启动对应的容器。也正是通过容器技术，FaaS可保证每个函数的独立性。
3. 初始化运行环境：分析代码依赖、执行用户初始化逻辑、初始化入口函数之外的代码等操作。
4. 运行代码：调用入口函数执行代码。这个过程比较特殊，可能是冷启动，也可能是热启动。

####  ![serverless-2](/Users/guohaohao3/Documents/Joker/Git/fe-growth-path/imgs/serverless/serverless-2.png)各种语言冷启动时间排行

冷启动的时长取决于几个核心变量，如语言、运行时、专用于函数的资源量以及所运行函数汇总的包和依赖关系等。

![serverless-3](/Users/guohaohao3/Documents/Joker/Git/fe-growth-path/imgs/serverless/serverless-3.png)

# FaaS的两种进程模型

一种是用完即毁，对应从0到1的冷启动，一种是常驻内存，对应函数实例可复用的热启动。

常驻不是永存，如果一段时间内没有时间触发，函数实例还是会被销毁的。热启动在一定程度上可以提高请求处理效率和响应性能，但这不是我们想要的。

# 冷启动优化方案

#### 为什么要对冷启动要进行优化呢 ？

1. 通过上面冷启动时间排行可以看到，最优的是nodejs，启动事件也在200ms左右。本地函数和云函数的调用是不一样的，本地函数是随着调用立即响应的，不会有延迟问题，而云函数部署计算运行环境，这个过程需要几百毫秒的时间，在对延迟有特殊要求的场景时可能会导致超时等问题的。
2. 云函数是有自动扩容的特点的，在没有调用的时候它会极致的缩容到0，或者少调用量时会进行资源的回收清除，而调用量新增是又会触发冷启动，这个过程是反复进行的。

冷启动耗时大头主要是以下三方面

1. 虚拟机和容器的创建过程，传统的虚拟机创建通常需要分钟的级别，容器需要秒的级别
2. 函数代码的下载过程，主要取决于代码的大小，下载耗时从几十毫秒到几秒不等
3. VPC网络的打通过程，主要是部署弹性网卡和路由下发的过程，通常耗时秒级别

优化方案

- 减少代码体积：
  - 开发者可以通过精简代码，删除无用依赖，加速下载函数代码过程
  - 比如腾讯云对代码做了两级的缓存，可以有效降低下载代码时间
- 资源复用，缩短函数执行时间
- 选择冷启动时间较少的语言
- 选择合适的内存：函数内存越大，冷启动表现越优
- 避免不必要的配置
- 降低冷启动频率
  - 使用定时触发器定时访问函数，这样可以防止函数实例一段时间没被使用被销毁
  - 使用 initializer 函数入口，函数计算会异步调用初始化接口，消除初始化用户代码的时间
- 预留实例

# 快速扩缩容

#### 纵向扩缩容和横向扩缩容

我们最先想到的扩容手段是增加CPU核数，例如从 4 核变成 8 核，那并发的子进程就有 7 个了。另外就是新添加机器，比如两台4核的机器，500个访问一台机器这样，我们并发的子进程也能增加到 6 个。

![serverless-4](/Users/guohaohao3/Documents/Joker/Git/fe-growth-path/imgs/serverless/serverless-4.png)

增加或减少单机性能就是纵向扩缩容，纵向扩缩容随着性能提升成本曲线会陡增，通常我们采用时要慎重考虑。而增加或减少机器数量就是横向扩缩容，横向扩缩容成本更加可控，也是我们最常用的默认扩缩容方式。

#### Stateful VS Stateless

在网络拓扑图中，Stateful 是存数据的节点；Stateless 是处理数据的节点，不负责保存数据。只有 Stateless 节点才能任意扩缩容，Stateful 节点因为是保存我们的重要数据，所以我们要谨慎对待。如果我们的网络拓扑节点想自由扩缩容，则需要将这个节点的数据操作外移到专门的 Stateful 节点。我们的 FaaS 访问 Stateful 节点，那我们就希望 Stateful 节点对 FaaS 提供数据接口，而不是单纯的数据库指令，因为数据库连接会增加 FaaS 的额外开支。另外为了方便后端同学开发，我们需要将 Stateful 节点 BaaS 化，这样也简化了FaaS的开支。

#### 后端应用 BaaS 化

BaaS 化的核心思想就是将后端应用转换成 NoOps 的数据接口，这样 FaaS 在 SFF 层就可以放开手脚，而不用再考虑冷启动时间了。后端应用接口化只是 BaaS 化的一小部分，BaaS 化最重要的部分是后端数据接口应用的开发人员也可以不再关心服务端运维的事情。

![serverless-5](/Users/guohaohao3/Documents/Joker/Git/fe-growth-path/imgs/serverless/serverless-5.png)

## 京准通当前架构与serverless架构对比

#### 容器化： K8S + Docker

#### 服务化：将接口、页面、组件进行服务化的部署与调用，根据业务进行更细致的服务化拆分，这是实现serverless架构的基础。

#### CI/CD：jenkins/travis + 自动化测试等

## 使用场景

#### 纯页面组件的ssr渲染

ssr的最大好处就是提高首屏渲染性能，因为ssr组件或者页面的交互需要用cookie进行交互，所以这里不建议进行交互性的页面组件渲染

#### 交互组件

对与需要交互的组件/页面，可以打包成一个js，通过es6的import进行导入，进行class的初始化，实现数据交互与方法调用；或者说将属性挂载到window上进行使用

#### Node中间层的接口服务

# 开源的 Serverless 框架

Kubernetes 的蓬勃发展由催生了一系列以它为基础的 Serverless 应用，目前开源的 Serverless 框架大多以 Kubernetes 为基础。

- [dispatch](https://github.com/vmware/dispatch) - Dispatch is a framework for deploying and managing serverless style applications.
- [faas-netes](https://github.com/alexellis/faas-netes) - Enable Kubernetes as a backend for Functions as a Service (OpenFaaS) https://github.com/alexellis/faas
- [firecamp](https://github.com/cloudstax/firecamp) - Serverless Platform for the stateful services
- [fission](https://github.com/fission/fission) - Fast Serverless Functions for Kubernetes [http://fission.io](http://fission.io/)
- [fn](https://github.com/fnproject/fn) - The container native, cloud agnostic serverless platform. [http://fnproject.io](http://fnproject.io/)
- [funktion](https://github.com/funktionio/funktion/) - a CLI tool for working with funktion https://funktion.fabric8.io/
- [fx](https://github.com/metrue/fx) - Poor man's serverless framework based on Docker, Function as a Service with painless.
- [gloo](https://github.com/solo-io/gloo) - The Function Gateway built on top of Envoy.
- [ironfunctions](https://github.com/iron-io/functions) - IronFunctions - the serverless microservices platform. [http://iron.io](http://iron.io/)
- [knative](https://github.com/knative) - Kubernetes-based platform to build, deploy, and manage modern serverless workloads.
- [knative-lambda-runtime](https://github.com/triggermesh/knative-lambda-runtime) - Running AWS Lambda Functions on Knative/Kubernetes Clusters [https://triggermesh.com](https://triggermesh.com/)
- [kubeless](https://github.com/kubeless/kubeless) - Kubernetes Native Serverless Framework [http://kubeless.io](http://kubeless.io/)
- [nuclio](https://github.com/nuclio/nuclio) - High-Performance Serverless event and data processing platform.
- [openfaas](https://github.com/openfaas/faas) - OpenFaaS - Serverless Functions Made Simple for Docker & Kubernetes https://blog.alexellis.io/introducing-functions-as-a-service/
- [openwhisk](https://openwhisk.incubator.apache.org/) - Apache OpenWhisk (Incubating) is a [serverless](https://en.wikipedia.org/wiki/Serverless_computing), open source cloud platform that executes functions in response to events at any scale.
- [riff](https://github.com/projectriff/riff) - riff is for functions [https://projectriff.io](https://projectriff.io/)
- [serverless](https://github.com/serverless/serverless) - Serverless Framework – Build web, mobile and IoT applications with serverless architectures using AWS Lambda, Azure Functions, Google CloudFunctions & more! – [https://serverless.com](https://serverless.com/)
- [spec](https://github.com/cloudevents/spec) - CloudEvents Specification [https://cloudevents.io](https://cloudevents.io/)
- [thanos](https://github.com/improbable-eng/thanos) - Highly available Prometheus setup with long term storage capabilities.



# 参考文档

阿里云函数计算：https://help.aliyun.com/document_detail/52895.html?spm=a2c4g.11186623.6.542.979d10f394oRpI

腾讯云原函数快速入门： https://main.qcloudimg.com/raw/document/product/pdf/583_9177_cn.pdf

Serverless Handbook: https://jimmysong.io/serverless-handbook/

AWS Lambda 最新编程语言冷启动时间测试：Node.js 性能最高： https://www.infoq.cn/article/7flvicetoviyajkmgb1c

腾讯云函数计算冷启动优化实践： https://www.tengxunyun8.com/953.html

Awesome Cloud Native – serverless 开源框架来源：https://jimmysong.io/awesome-cloud-native/#serverless