# webpack常用配置项

```js
 let path = require('path');
 let HtmlWebpackPlugin = require('html-webpack-plugin')
 let MiniCssCxtractPlugin = require('mini-css-cxtract-plugin');
 let optimizeCss = require('optimize-css-assets-webpack-plugin');
 let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
 let webpack = require('webpack');
 //模块happypack可以实现多线程打包
 let happypack = require('happypack');
 module.exports = {
	optimization:{ //优化项
		minimizer:{
			new UglifyJsPlugin({
				cache:true, //是否需要缓存
				parallel:true, //是否需要并发打包
				sourceMap:true //压缩后是否需要源码映射
			})，
			new optimizeCss();
		},
		splitChunks:{ //分隔代码块
			cacheGroups:{ //缓存组
				common:{ //公共的模块
					chunks:'initial', //入口处
					minSize:0, //多大的字节被公用的时候需要抽离
					minChunks:2, //文件引用次数超过几次需要抽离
				},
				vendor:{ //第三方插件的抽离
					priority:1, //添加权重，意思就是先抽离vendor里的插件
					test:/node_modules/, //把node_modules抽离出来
					chunks:'initial', //入口处
					minSize:0, //多大的字节被公用的时候需要抽离
					minChunks:2, //文件引用次数超过几次需要抽离
				}
			}
		}
	},
	mode:'development', //默认两种 production development
	entry:'./src/index.js', //入口
	//如果需要多个入口的时候
	entry:{
		index:'./src/index.js',
		other:'./src/other.js'
	},
	output:{
		filename:'bundle.js', //打包后的文件名
		//filename:'bundle.[hash:8].js' //每次生成的文件后面带哈希戳，每次都不一样，可通过配置改变显示位数
		path:path.resolve(__dirname,'dist') //路径必须是一个绝对路径
	}, 
	//如果有多个入口，必须对应多个出口
	output:{
		filename:[name].js,
		path:path.resolve(__dirname,'dist')
	}
	devServer:{ //开发服务器的配置
		port:3000, //开启的端口号
		progress:true, //是否需要看到进度条
		contentBase:path.resolve(__dirname,'dist'), //对外提供的访问内容的路径
		open:true, //是否自动打开浏览器
		compress:true，//是否开启gzip压缩
		hot:true, //启用热更新
	},
	plugins:[ //数组 放着所有的webpack插件
		new HtmlWebpackPlugin({
			template:'./src/index.html', //源文件
			filename:'index.html', //生成后的文件名
			minify:{ //生成的html文件压缩配置
				removeAttributeQuotes:true, //是否删除属性上的双引号
				collapseWhitespace:true, //是否一行显示
			},
			hash:true, //引入的src文件带哈希戳(防止缓存)
		}),
		new MiniCssCxtractPlugin({
			filename:'main.css', //抽离出来的样式名
		}),
		new webpack.ProvidePlugin:{ //在每个模块中都导入$
			$:'jquery'
		},
		externals:{ //说明里面的属性是外部引入的，不打包
			jquery:'$'
		}，
		new webpack.IgnorePlugin(需要忽略的文件,来源), //这个可以忽略特定打包某些文件，除非按需引入，比如UI组件之类的。
		new happypack({
			id:'js',
			use:[{
				loader:'babel-loader',
				options:{ //用babel-loader将es6转换为es5
					presets:[ //预设
						'@babel-preset-env'
					],
					plugins:[ //各类小插件集合
						['@babel/plugin-proposal-decorators',{"legacy":true}],
						['@babel/plugin-proposal-class-properties',{"loose":true}],
						'@babel/plugin-transform-runtime'
					]
				}
			}]
		}),
		new happypack({
			id:'css',
			use:[{
				loader:'style-loader'，
				options:{
					insertAt:'top', //style标签插到顶部，可以用来覆盖页面内置样式
				}
			},'css-loader','postcss-loader']
		}),
		new webpack.NamedModulesPlugin(),//打印更新的模块路径,在hotReplace.js中查看demo
		new webpack.HotModuleReplacementPlugin() //热更新插件
	],
	module:{ //模块
		noParse:/jQuery/, //不去解析指定库中的依赖关系(属于优化范畴)
		rules:[ //规则 loader模式是从右到左，从下到上执行的
			{ //在配置文件里配置将某个插件暴露全局的方法
				test:require.resolve('jquery'),
				use:'expose-loader?$'
			},
			{
				test:/\.js$/,
				exclude:/node_modules/,//(输入优化范畴)
				include:path.resolve(__dirname,'src'),
				use:{
					laoder:'eslint-loader',
					options:{
						enforce:'pre' //previous 强制让该loader在之前执行(因为默认最上面的最后执行)，还有post选项，代表在之后执行
					}
				}
			},
			{
				test:/\.js$/, //默认执行顺序 normal 普通的loader
				//如果不用happypack打包
				use:{
					loader:'babel-loader',
					options:{ //用babel-loader将es6转换为es5
						presets:[ //预设
							'@babel-preset-env'
						],
						plugins:[ //各类小插件集合
							['@babel/plugin-proposal-decorators',{"legacy":true}],
							['@babel/plugin-proposal-class-properties',{"loose":true}],
							'@babel/plugin-transform-runtime',
							'@babel/plugin-syntax-dynamic-import'
						]
					}	
				},
				//如果使用happypack打包
				use:'happypack/loader?id=js',
				exclude:/node_modules/, //设置不匹配的目录
				include:path.resolve(__dirname,'src') //设置匹配的目录
			},
			{
				test:/\.css$/,
				use:[
					//如果用MiniCssCxtractPlugin,对于style-loader
					MiniCssCxtractPlugin.loader,
					//如果不用MiniCssCxtractPlugin
					{
						loader:'style-loader'，
						options:{
							insertAt:'top', //style标签插到顶部，可以用来覆盖页面内置样式
						}
					},
					'css-loader',
					'postcss-loader'
				]
			},
			{
				test:/\.less$/,
				use:[
					MiniCssCxtractPlugin.laoder,
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			}
		]
	}
 }
 
 //开发依赖
 
 webpack-dev-server //生成内存中的打包文件，生成本地服务
 @babel/core //babel核心模块
 @babel/preset-env //转化模块，可以将高级语法转换为低级语法
 @babel/plugin-proposal-class-properties //对class语法的解析
 @babel/plugin-proposal-decorators //对装饰器的解析
 @babel/plugin-transform-runtime //转化一些识别不了的高级语法，类似promise等等
 happypack //多线程打包工具
 autoprofixer //自动添加浏览器前缀所需工具
 @babel/plugin-syntax-dynamic-import //语法动态导入的插件，用于导入import之类的插件,返回一个promise对象default属性上,用来实现懒加载
 
 //运行依赖
 
 @babel/runtime //需要往生产环境输出脚本,打补丁
 @babel/polyfill //默认放在实例上的方法不解析,如果是高级语法的话需要用这个来解析
 
 //loader(特点：单一，组合性强，有顺序，默认从右向左,从下到上执行)
 //loader还可以写成对象方式，可以通过options参数传参
 
 css-loader //解析css中@import这种语法的，或者说解析路径的。
 style-loader //将css插入到head标签中。
 less-loader //可以处理less预处理的样式，将less转换为css
 sass-loader //可以处理sass预处理的样式，将sass转换为css
 stylus-loader //可以处理stylus预处理的样式，将stylus转换为css
 postcss-loader //自动添加浏览器前缀(需要添加postcss.config.js和安装 autoprofixer )
 babel-loader //babel加载器
 eslint-loader //给js添加校验规则(可在官网下载.eslintrc.json来配置)
 expose-loader //暴露 全局的loader(内敛loader,比如import $ from 'expose-loader?$!jquery'就把jquery以$暴露给全局对象)
 
 //plugins
 
 html-webpack-plugin //将生成的目录里也加载相应的html
 mini-css-cxtract-plugin //抽离css
 optimize-css-assets-webpack-plugin //压缩css文件
 uglifyjs-webpack-plugin //在运行了上面的压缩css插件后，js压缩会失效，需要这个插件压缩js
 
 //备注：
 //1.import在生产环境下，会自动去除没用的代码，tree-shaking把没用到的代码，自动删除掉，es6模块会把结果放到default上，比如import一个对象里面
 //有n个方法，但是只用到一个，打包的时候去自动把其他方法去掉。但是require就没有这个作用。
 
 //Tapable
 //Webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable，Tapable有点类似于nodejs的events库，
 //核心原理也是依赖于发布订阅模式。
```

