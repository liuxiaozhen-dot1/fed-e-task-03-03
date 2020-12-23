#### 访问地址 https://fed-e-task-03-03-gqizms24o.vercel.app/

##### 什么是vuex 

vuex是专门为vue.js设计的状态管理库

vuex 采用的是集中式的方式存储需要共享的状态

vuex的作用是进行状态管理，解决复杂的组件通信，数据共享

vuex集中到了devtools中，提供了time-travel时光之旅行历史回滚功能

什么情况下使用vuex

非必要的情况下不要使用vuex 

大型的单页面应用程序

​    多个视图依赖同一个状态

​    来自不同视图的行为需要变更同一状态

##### 核心概念

store  state  getter  mutation action 

module  把单一状态树拆分成多个模块。开启命名空间 更清晰


```js
const state = {
  // 存储购物车商品
  // 把数据放在本地存储中
  cartProducts: JSON.parse(window.localStorage.getItem('cart-products')) || []
}


const myPlugin = store => {
  store.subscribe((mutation, state) => {

    // 是否是carts中的  只是carts需要products不需要目前

    //使用mutation.type进行判断这个页面是否需要加载本地数据

    if (mutation.type.startsWith('carts/')) {

      // 获取数据并且把对象转换成字符串

      window.localStorage.setItem('cart-products', JSON.stringify(state.carts.cartProducts))
    }
  })
}
```


##### SPA 单页面应用

优点

用户体验好

开发效率高

渲染性能好

可维护性好

缺点：

首屏渲染时间长

不利于SEO


##### 同构应用

通过服务端渲染首屏直出，解决SPA应用首屏渲染慢以及不利于SEO的问题

通过客户端渲染接管页面的内容交互得到更好的用户体验

这种方式称之为现代化的服务端渲染，也叫同构渲染

这种方式构建的应用称之为服务端渲染应用或者同构应用

##### nuxt

1. nuxt中把请求数据放在asyncData中有助于SEO

2. watchQuery 默认情况下，query改变不会触发asyncData方法，例如在构建分也组件时。可以通过设置对应页面组件watchQuery属性监听参数

3. 
```js
module.exports = {

  router: {

    linkActiveClass: 'active',

    // 自定义路由表规则

    extendRoutes(routes, resolve) {

      // 清除Nuxt.js基于pages目录生成的路由表规则

      routes.splice(0)
```