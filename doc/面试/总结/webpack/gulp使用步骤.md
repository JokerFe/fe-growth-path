# gulp使用步骤

### 安装gulp打包所用到的包

```nginx
# gulp
$ npm install gulp --save-dev

# gulp-watch 用来监听文件的变化，自动执行gulp 比gulp自带的更好用和可控
$ npm install gulp-watch --save-dev

# gulp-babel 用来将es6的语法进行编译 -- 
$ npm install --save-dev gulp-babel @babel/core  

# babel的插件 主要是将import转成require
$ npm install --save-dev babel-plugin-transform-es2015-modules-commonjs

# gulp-rollup 流清理tree-shaking 
$ npm install --save-dev gulp-rollup

# rollup-plugin-replace 用来将配置文件中的process.env.NODE_ENV 替换掉
$ npm install --save-dev rollup-plugin-replace 

# @babel/plugin-proposal-class-properties 此插件转换静态类属性以及使用属性初始化器语法声明的属性。
# @babel/plugin-proposal-decorators 将类和对象装饰器编译到es5
```

### 创建gulpfile.js文件

```js
const gulp = require("gulp");
const babel = require("gulp-babel");
const watch = require('gulp-watch');
const rollup = require('gulp-rollup');
const replace = require('rollup-plugin-replace');
const entry = "src/serve/**/*.js";
// 开发环境
function builddev() {
    return watch(entry, { ignoreInitial: false }, function () {
        gulp.src(entry)
            .pipe(babel({
                babelrc: false, // false时不使用外边的 .babelrc的文件
                ignore: ["./src/serve/config.js"], // 让babel忽略的文件
                "plugins": ['babel-plugin-transform-es2015-modules-commonjs'] // 将import等编译成es2015
            }))
            .pipe(gulp.dest('dist'))
    })

}
// 清洗配置文件
function buildconfig() {
    return gulp.src(entry)
        .pipe(rollup({
            output: {
                format: "cjs"
            },
            plugins: [
                // rollup-plugin-replace 用来将配置文件中的process.env.NODE_ENV 替换掉
                replace({
                    "process.env.NODE_ENV": JSON.stringify('production')
                })
            ],
            input: './src/serve/config.js' // 入口文件  这个路径就是babel排除的文件
        }))
        .pipe(gulp.dest('./dist'));
}

// 上线环境
function buildprod() {
    return gulp.src(entry)
        .pipe(babel({
            babelrc: false,
            "plugins": ['babel-plugin-transform-es2015-modules-commonjs']
        }))
        .pipe(gulp.dest('dist'))
}
// 测试使用
function buildlint() {

}

let build = gulp.series(builddev);
if (process.env.NODE_ENV == "production") {
    build = gulp.series(buildprod, buildconfig);
}
if (process.env.NODE_ENV == "lint") {
    build = gulp.series(buildlint);
}
gulp.task("default", build);
```

### 在package.json中创建执行命令

```js
// package.json
$   "server:dev": "cross-env NODE_ENV=development gulp",
$   "server:prod": "cross-env NODE_ENV=production gulp",
$   "server:lint": "cross-env NODE_ENV=lint gulp"
```

可以将这些命令通过*scripty*抽出，通过shell的方式来执行。 scripty可自动查找scripts文件夹的sh文件进行执行脚本，将上述命令抽离成如下：

```js
// package.json
$   "server:dev": "scripty",
$   "server:prod": "scripty",
$   "server:lint": "scripty"
```

![gulp1](./img/gulp1.png)

在执行的时候需注意会提示你将scripty文件的执行权限开启，使用如下命令

```nginx
$ sudo chmod -R a+x scripts
```

