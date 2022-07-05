// 1
var yideng = {
    bar:function(){
        return this.baz
    },
    baz:1
}
(function(){
    console.log(typeof arguments[0]());
})(yideng.bar);

// 2
// function test(){
//     console.log("out");
// }
// (function(){
//     if(false){
//         function test(){
//             console.log("in");
//         }
//     }
//     test();
// })();

// 3
// var x = [typeof x,typeof y][1];
// typeof x;

// 4
// (function (x){
//     delete x;
//     return x;
// })(1);

// 5
// var x = 1;
// if(function f(){}){
//     x += typeof f;
// }
// x;

// 6
// function f(){
//     return f;
// }
// new f() instanceof f;

// 7
// Object.prototype.a = 'a';
// Function.prototype.a = 'a1';
// function Person(){};
// var yideng = new Person();
// console.log(yideng.a);

// 8
// var yideng = [0];
// if(yideng){
//     console.log(yideng == true);
// }else{
//     console.log("yideng");
// }

// 9
// function yideng(){
//     return {
//         a:1
//     }
// }
// var result = yideng();
// console.log(result.a);

// 10 
// const timeout = ms=>new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve();
//     })
// },ms)
// const ajax1 = ()=>timeout(2000).then(()=>{
//     console.log("1");
//     return 1;
// })
// const ajax2 = ()=>timeout(1000).then(()=>{
//     console.log("2");
//     return 2;
// })
// const ajax3 = ()=>timeout(2000).then(()=>{
//     console.log("3");
//     return 3;
// })
// const mergePromise = (ajaxArray)=>{
//     // 1,2,3 done [1,2,3] 此处写代码 请写出 ES6、ES3 2种解法

// }
// mergePromise([ajax1,ajax2,ajax3]).then(data=>{
//     console.log("done");
//     console.log(data); // data 为 [1,2,3]
// });
// 执行结果 1 2 3 done [1,2,3]

// 11
// <script>
//   yideng;
//   console.log(1);
//</script>
//<script>
//    console.log(2);
//</script> 

// 12
// var yideng = Array(3);
// yideng[0] = 2;
// var result = yideng.map(function(elem){
//     return '1';
// });
// console.log(result);

// 13
// while(1){
//     switch ("yideng"){
//         case "yideng":
//             // ====禁止直接写一句break====
//     }
// }
// ====请修改代码跳出死循环====

// 14 
// while(1){
//     consooe.log(Math.random());
// }
// ====请让上述代码顺利运行====

// 15
// [1<2<3,3<2<1]
// ====写出上述代码执行结果====

// 16
// 2==[[[2]]]
// ====请写出以上代码执行结果====

// 17
// console.log('✈️',length);
// - 计算以上字节每位✈️的起码点
// - 请描述这些字节的起点码代表什么

// 18
// var yidenga = Function.length,
// yidengb = new Function().length;
// console.log(yidenga == yidengb);

// 19
// var length = 10;
// function fn(){
//     console.log(this.length);
// }
// var yideng = {
//     length:5,
//     method:function(){
//         fn();
//         arguments[0]();
//     }
// };
// yideng.method(fn,3);

// 20 
// var yi = new Date('2018-08-20'),
//     deng = new Date(2018,08,20);
// [yi.getDay() === deng.getDay(),yi.getMonth()=== deng.getMonth()];

// 21
// for (let i = (setTimeout(()=>{console.log('a->',i)}),0); setTimeout(()=>console.log('b->',i)),i<2;i++){
//    i++;
// }

// 22 
// [typeof null,null instanceof Object];

// 23 
//<textarea maxlength=10 id="yideng"></textarea>
//    <script>
//        document.getElementById("yideng").value = 'a'.repeat(10)+'b';
//    </script>

// 24
// function sidEffecting(ary){
//     ary[0] = ary[2];
// }
// function yideng(a,b,c=3){
//     c=10;
//     sidEffecting(arguments);
//     return a + b + c;
// }
// yideng(1,1,1);

// 25 
// function sidEffecting(ary){
//     ary[0] = ary[2];
// }
// function yideng(a,b,c){
//     c=10;
//     sidEffecting(arguments);
//     return a + b + c;
// }
// yideng(1,1,1);

// 26
// yideng();
// var flag = true;
// if(flag){
//     function yideng(){
//         console.log("yideng1");
//     }
// }else{
//     function yideng(){
//         console.log("yideng2");
//     }
// }

// 27 
// var min = Math.min(),max=Math.max();
// console.log(min<max);

// 28 
// var big = "志佳老师";
// var obj = {
//     big:"一灯",
//     showBig:function(){
//         return this.big;
//     }
// }
// obj.showBig.call(big);

// 29
// function yideng(a,b,c){
//     console.log(this,length);
//     console.log(this.callee.length);
// }
// function fn(d){
//     arguments[0](10,20,30,40,50);
// }
// fn(yideng,10,20,30);

// 30
// var a = "yideng";
// function test(){
//     var a = "yideng2";
//     var init = new Function("console.warn(a)");
//     init();
// }
// test();

// 31
// console.log({}+[]);
// {}+[];

// 32
// var f = function yideng(a){
//     yideng=a;
//     console.log(typeof yideng);
//     return 23;
// }
// f("京程一灯");
// console.log(typeof yideng);





