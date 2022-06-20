# Promise.all与Promise.race的实现

## Promise.all

```js
Promise.all = arr => {
  let aResult = [];
  return new _Promise(function(resolve,reject){
    let i = 0;
    next();
    function next(){
      arr[i].then(function(res){
        aResult.push(res);
        i++;
        if(i == arr.length){
          resolve(aResult);
        }else{
          next();
        }
      })
    }
  })
}
```

## Promise.race

```js
Promise.race = function(values){
  return new Promise(resolve,reject)=>{
    for(let i =0;i<values.length;i++){
      let current = values[i];
      if(typeof current === 'object' && current !== null || typeof current == 'function'){
        let then = current.then;
        if(typeof then == 'function'){//比较哪一个promise快，哪个快用哪个
          then.call(current,resolve,reject)
        }else{
          resolve(current)
        }
      }else{
        resolve(current)
      }
    }
  }
}
```

