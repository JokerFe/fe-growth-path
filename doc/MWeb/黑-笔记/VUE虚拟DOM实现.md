# 虚拟DOM实现

## 创建虚拟DOM

```js
const createVApp = count => createElement('div',{
  attrs:{
    id:'app',
    dataCount:count
  },
  children:[
    createElement('input',{
      attrs:{
        value:count
      }
    }),
    String(count),
    createElement('img',{
      attrs:{
        src:'http://placehold.it/81x81'
      }
    })
  ]
})
const createElement =(tagName,{attrs={},children=[]}={})=>{
  return {tagName,attrs,children}
}
```

## 渲染函数

```js
const render = (vNode) => {
  if(typeof vNode ==='string'){
    return document.createTextNode(vNode);
  }
  return renderElem(vNode);
}
const renderElem=({tagName,attrs,children})=>{
  const $el = document.createElment(tagName);
  for(const [k,v] of Object.entires(attrs)){
    $el.setAttribute(k,v)
  }
  for(const child of children){
    const $child = render(child);
    $el.appendChild($child);
  }
  return $el;
}
```

## 渲染到页面

```js
const mount = ($node,$target) => {
  $target.replaceWith($node);
  return $node;
}
```

## diff算法

```js
const zip = (xs,ys) => {
  const zipped = [];
  let minLength = Math.min(xs.length,ys.length);
  for(let i=0;i<minLength;i++){
    zipped.push(xs[i],ys[i])
  }
  return zipped;
}
const diff = (vOldNode,vNewNode) => {
  if(vNewNode == undefined){
    return $node => {
      $node.remove();
      return undefined;
    }
  }
  if(typeof vOldNode==='string'||typeof vNewNode ==='string'){
    if(vOldNode!==vNewNode){
      return $node =>{
        const $newNode = render(vNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      }
    }else{
      return $node =>undefined
    }
  }
  if(vOldNode.tagName!==vNewNode.tageName){
    return $node =>{
      const $newNode = render(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    }
  }
  const patchAttrs = diffAttrs(vOldNode.attrs,vNewNode.attrs);
  const patchChildren = diffChildren(vOldNode.chilren,vNewNode.children)
  return $node = {
    patchAttrs($node);
    patchChildren($node);
  	return $node;
	}
}
const diffAttrs = (oldAttrs,newAttrs) => {
  const patches = [];
  for(const [k,v] of Object.entires(newAttrs)){
    patches.push($node=>{
      $node.setAttribute(k,v);
      return $node
    })
  }
  for(const [k,v] of Object.entires(oldAttrs)){
    if(!(k in newAttrs)){
      patches.push($node=>{
        $node.removeAttribute(k);
        return $node;
      })
    }
  }
  return $node => {
    for(const patch of patches){
      patch($node)
    }
  }
}
const diffChildren = (oldVChildren,newVChildren) => {
  const childPatches = [];
  let zipped = zip(oldVChildren,newVChildren);
  for(let [oldVChildren,newVChildren] of zipped) {
    childPatches.push(diff(oldVChild,newVChild));
  }
  const additionalPatches = [];
  for(const additionalVChild of newVChildren.slice(oldVChildren.length)){
    additionalPatches.push($node=>{
      $node.appendChild(render(additionalVChild))
      return $node;
    })
  }
  return $parent => {
    for(const [patch,child] of zip(childPatches,$parent.childNodes)){
      patch(child);
    }
    for(const patch of additionalPatches){
      patch($parent);
    }
    return $parent;
  }
}
```

## 简易实现

```js
let count = 0;
let vApp = createVAPP(count);
const $app = render(vApp);
let $rootEl = mount($app,document.getElementById('app'));
setInterVal(()=>{
  count++;
  let vNewApp = createVApp(count);
  const Patch = diff(vApp,vNewApp);
  $rootEl = patch($rootEl);
  vApp = vNewApp;
},1000)
```

