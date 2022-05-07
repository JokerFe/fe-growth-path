# 请说出前端框架设计模式(MVVM 或 MVP 又或 MVC)的含义以及原理

MVC，MVP和MVVM都是常见的软件架构设计模式 (Architectural Pattern)，它通过分离关注点来改进代码的组织方
式。不同于设计模式(Design Pattern)，只是为了解决一类问题而总结出的抽象方法，一种架构模式往往使用了多种设计模式。
要了解MVC、MVP和MVVM，就要知道它们的相同点和不同点。不同部分是C(Controller)、 P(Presenter)、 VM(View-M
odel)，而相同的部分则是MV(Model-View)。

## 一、Model&View

### Model

Model层用于封装和应用程序的业务逻辑相关的数据以及对数据的处理方法。

#### View

View作为视图层，主要负责数据的展示。但对于一个应用程序，这远远是不够的，我们还需要响应用户的操作、同步更新View和Model。于是，在MVC中引入了控制器controller，让它来定义用户界面对用户输入的响应方式，它连接模型和视图，用于控制应用程序的流程，处理用户的行为和数据上的改变。

## 二、 MVC

上个世纪70年代，美国施乐帕克研究中心，就是那个发明图形用户界面(GUI的公司，开发了Smalltalk编程语言，并开始用它编写图形界面的应用程序。
到了Smalltalk-80这个版本的时候，一位叫Trygve Reenskaug的工程师为Smalltalk设计了MVC (Model-View-Controll
er）这种架构模式，极大地降低了GUI应用程序的管理难度，而后被大量用于构建桌面和服务器端应用程序。
MVC允许在不改变视图的情况下改变视图对用户输入的响应方式，用户对View的操作交给了 Controller处理， 在Controller中响应View的事件调用Model的接口对数据进行操作，一旦Model发生变化便通知相关视图进行更新。

#### Model

Model层用来存储业务的数据，一旦数据发生变化，模型将通知有关的视图。
Model和View之间使用了观察者模式，View事先在此Model上注册，进而观察Model，以便更新在Model上发生改变的数
据。

#### View

view和controller之间使用了策略模式，View引l入Controller的实例来实现特定的响应策略

#### Controller

控制器是模型和视图之间的纽带，MVC将响应机制封装在controller对象中，当用户和你的应用产生交互时，控制器中的事件触发器就开始工作了。
MVC模式的业务逻辑主要集中在Controller，而前端的View其实已经具备了独立处理用户事件的能力，当每个事件都流经Controller时，这层会变得十分臃肿。而且MVC中View和Controller一般是一一对应的，捆绑起来表示一个组件，视图与控制器间的过于紧密的连接让Controller的复用性成了问题，如果想多个View共用一个Controller该怎么办呢？这里有一个解决方案：就是MVP

## 三、MVP

MVP (Model-View-Presenter)是MVC模式的改良，由IBM的子公司Taligent提出。和MVC的相同之处在于：Controller/Presenter负责业务逻辑，Mode/管理数据，View负责显示。

虽然在MVC里，View是可以直接访问Model的，但MVP中的View并不能直接使用Model，而是通过为Presenter提供接
口，让Presenter去更新Model，再通过观察者模式更新View。
与MVC相比，MVP模式通过解耦View和Model，完全分离视图和模型使职责划分更加清晰；由于View不依赖Model，可以将View抽离出来做成组件，它只需要提供一系列接口提供给上层操作。

#### Model

Model层依然是主要与业务相关的数据和对应处理数据的方法。

#### View

MVP定义了Presenter和View之间的接口，用户对View的操作都转移到了Presenter。
View 非常薄，不部署任何业务逻辑，称为"被动视图"(Passive View)，即没有任何主动性，而 Presenter非常厚，所有逻辑都部署在那里

#### Presenter

Presenter作为View和Model之间的“中间人”，除了基本的业务逻辑外，还有大量代码需要对从View到Model和从Model到View的数据进行“手动同步”，这样Presenter显得很重，维护起来会比较困难。而且由于没有数据绑定，如果Presenter对视图渲染的需求增多，它不得不过多关注特定的视图，一旦视图需求发生改变，Presenter也需要改动。

## 四、MVVM

MVVM (Model-View-ViewModel) 最早由微软提出。ViewModel指 "“Model of View"——视图的模型。这个概念曾在一
段时间内被前端圈热炒，以至于很多初学者拿Query和Vue做对比。

MVVM把View和Model的同步逻辑自动化了。以前Presenter负责的View和Model同步不再手动地进行操作，而是交给框架所提供的数据绑定功能进行负责，只需要告诉它View显示的数据对应的是Model哪一部分即可。
基本上与 MVP 模式完全一致。唯一的区别是，它采用双向绑定 (data-binding)，View的变动，自动反映在ViewModel，反之亦然。Angular 和 Ember 都采用这种模式。

#### Model

在MVVM中，我们可以把Model称为数据层，因为它仅仅关注数据本身，不关心任何行为 (格式化数据由View的负责）

#### View

和MVC/MVP不同的是，MVVM中的View通过使用模板语法来声明式的将数据渲染DOM，当ViewModel对Model进行
更新的时候，会通过数据绑定更新到View。

#### ViewModel

ViewModel大致上就是MVC的Controller和MVP的Presenter了，也是整个模式的重点，业务逻辑也主要集中在这里，其中的一大核心就是数据绑定。
与MVP不同的是，没有了View为Presente提供的接口，之前由Presenter负责的View和Model之间的数据同步交给了ViewModel中的数据绑定进行处理，当Model发生变化，VewModel就会自动更新；ViewModel变化，Model也会更新。
整体来看，比MVC/MVP精简了很多，不仅仅简化了业务与界面的依赖，还解决了数据频繁更新（以前用jQuery操作DOM很繁琐）的问题。因为在MVVM中，View不知道Model的存在，ViewModel和Model也察觉不到View，这种低耦合模式可以使开发过程更加容易，提高应用的可重用性。

## 五、总结

MV*的目的是把应用程序的数据、业务逻辑和界面这三块解耦，分离关注点，不仅利于团队协作和测试，更有利于维护和管理。业务逻辑不再关心底层数据的读写，而这些数据又以对象的形式呈现给业务逻辑层。从 MVC -->MVP --> MVVM,就像一个打怪升级的过程，它们都是在MVC的基础上随着时代和应用环境的发展衍变而来的。
在我们纠结于使用什么架构模式或框架的时候，不如先了解它们。静下来思考业务场景和开发需求，不同需求下会有最适合的解决方案。我们使用这个框架就代表认同它的思想，相信它能够提升开发效率解决当前的问题，而不仅仅是因为大家都在学。