// 第一题
function Base(){
    this.sex=0;
    this.name=name || "base";
    this.hello=function(){
        console.log("hello "+ name);
    };
}
Base.prototype.say=function(){
    console.log('name'+this.name);
}
function Extend (name,num){
    Base.call(this,name);
    this.num= num || 0;
}
Extend.prototype=new Base();
Extend.prototype.constructor=Extend;
var one =new Extend('one',2);
console.log(Extend.__proto__);
console.log(one instanceof Extend);
console.log(one instanceof Base);
console.log(one.constructor === Extend);
console.log(one.__proto__ === Extend.prototype);
console.log(one.__proto__ === Base.prototype);




// 第二题
var  A = function(){};
A.prototype = {};
var a = new A();
A.prototype = {};
var b = new A();
console.log(a instanceof A);
console.log(b instanceof A);



Number.prototype.constructor
Number.prototype.constructor.constructor
Object.prototype.constructor.constructor.constructor