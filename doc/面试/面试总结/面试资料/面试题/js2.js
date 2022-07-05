// var a = 1;
// if(!(b in window)){
//     var b = a;
//     a += 1;
// }else{
//     a+=2;
// }
// console.log(a);
// console.log(b);


// var m = 1;
// function log(){
//     var m = 2;
//     return function(){
//         m+=1;
//     }
// }
// var _log = log();
// _log();
// console.log(m);


// for(var i=0;i<5;i++){
//     (function(){
//         setTimeout(function(){
//             console.log(i);
//         },1000);
//     })(i);
// }


function fun(){}
console.log(typeof fun);
console.log(fun instanceof Function);
console.log(fun instanceof Object);

var a = 1;
var obj = {
    a:2,
    getA:function(){
        return this.a;
    }
}
console.log(obj.getA());
console.log(obj.getA.call());
console.log(obj.getA.call({a:10}));

var arr = [1,2,3];
function test(arr){
    arr=[];
}
test(arr);
console.log(arr);


function Foo(){
    getName=function(){
        console.log(1);
    }
    return this;
}
Foo.getName = function(){
    console.log(2);
}
Foo.prototype.getName = function(){
    console.log(3);
}
var getName = function(){
    console.log(4);
}
function getName(){
    console.log(5);
}

Foo.getName();
getName();
Foo().getName();
getName();
// 2411
new Foo.getName(); 
new Foo().getName();
new new Foo().getName();
// 233