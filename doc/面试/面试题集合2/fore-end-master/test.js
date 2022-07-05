var throttle = function(func, time) {
    let preTime = 0;
    return function() {
        let nowTime = Date.now();
        console.log(preTime,nowTime)
        if (nowTime - preTime > time) {
            console.log('jinlaile')
            func.apply(this);
            preTime = nowTime;
        }
    }
  }
  var debounce = function(func,time) {
    let timer 
    return function() {
        console.log('jieliu')
      if(timer) clearTimeout(timer)
      timer = setTimeout(()=>{
        func.apply(this)
      },time)
    }
  }
  var test = function(){
      console.log('test');
  }