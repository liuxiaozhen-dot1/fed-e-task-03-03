#### 作业访问地址 https://fed-e-task-03-03-gqizms24o.vercel.app/

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

1. Nuxt.js 扩展了 Vue.js，增加了一个叫 asyncData 的方法，使得我们可以在设置组件的数据之前能异步获取或处理数据。
它会将asyncData返回的数据融合组件data方法返回数据一并给组件
调用时机：服务端渲染期间和客户端路由更新之前（保证了服务端和客户端都要运行处理数据）

注意事项
只能在页面组件中使用，非页面组件中不会调用asyncData方法，如果子组件中需要数据，可以通过props方式传递数据，没有this，因为它是在组件初始化之前被调用的
当你想用的动态页面内容有利于SEO或者是提升首屏渲染速度的时候，就在asyncData中发送请求数据。如果是非异步数据或者普通数据，则正常的初始化到data中。

2. watchQuery 默认情况下，query改变不会触发asyncData方法，例如在构建分也组件时。可以通过设置对应页面组件watchQuery属性监听参数



NuxtJS案例

1. 模版（将外部资源链接放入模板中）

2. 自定义路由表

```js
module.exports = {

  router: {

    linkActiveClass: 'active',

    // 自定义路由表规则

    extendRoutes(routes, resolve) {

      // 清除Nuxt.js基于pages目录生成的路由表规则

      routes.splice(0)
```

3. 通过计算属性中的登陆状态来判断页面的显示和隐藏，处理页面访问权限 – 使用中间件。

```js
export default function ({ store, redirect }) {
  // 如果用户未登录，则跳转到登录页
  if (!store.state.user) {
    return redirect('/login')
  }
}
```

```js
export default function ({ store, redirect }) {
  // 如果用户已登录，则跳转到首页
  if (store.state.user) {
    return redirect('/')
  }
}

```
4. 将两个没有依赖关系的异步任务通过使用Promise.all并行执行，优化请求

```js
import { getArticles } from '@/api/article'
import { getTags } from '@/api/tag'
export default {
  name: "HomePage",
  watchQuery: ['page'],
  async asyncData ({ query }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const [articleRes, tagRes] = await Promise.all([
      getArticles({
        limit,
        offset: (page - 1) * limit
      }),
      getTags()
    ])
    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data
    return {
      limit,
      page,
      articles,
      articlesCount,
      tags
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  }
};

```
5. 对路由精准匹配使用exact
6. 统一设置用户Token 新建plugins/request.js文件

 ```js
 /**
 * 基于axios封装的请求模块
 */
import axios from 'axios'

// 创建请求对象
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制获取到上下文对象（query、params、req、res、app、store···）
// 插件导出函数必须作为default成员
export default ({ store }) => {

  // 请求拦截器
  // Add a request interceptor
  // 任何请求都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共的业务处理，例如统一设置Token
  request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 请求就会经过这里
    const { user } = store.state
    if ( user && user.token)
    config.headers.Authorization = `Token ${user.token}`
    // 返回config请求配置对象
    return config;
  }, function (error) {
    // 如果请求失败（此时请求还没有发出去）就会进入这里
    // Do something with request error
    return Promise.reject(error);
  });
}

 ```
在nuxt.config.js中注册插件
```js
module.exports = {
  // 注册插件
  plugins: [
    '~/plugins/request.js', // 波浪线开头表示从根路径触发
  ]
}
```

7. 使用Dayjs对日期进行格式的优化  

```js

import Vue from 'vue'
import dayjs from 'dayjs'

// {{ 表达式 | 过滤器 }}
Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})

```
注册

```js
module.exports = {
  // ... 
  
	// 注册插件
  plugins: [
    '~/plugins/request.js', // 波浪线开头表示从根路径触发
    '~/plugins/dayjs.js',
  ]
}

```
使用

```js
<span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>

```

8. markdown转HTML yarn add markdown-it

```js
import MarkdownIt from 'markdown-it'
import { getArticle } from '@/api/article'
export default {
  name: 'ArticleIndx',
  async asyncData ({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article: article
    }
  }
}

```
使用
<div class="row article-content">
  <div class="col-md-12" v-html="article.body">
  </div>
</div>

9. js-cookie 在客户端渲染

```js
const Cookie = process.client ? require('js-cookie'): undefined

```

10. 发布部署

nuxt build 
nuxt start

使用pm2 运行服务器

```js
module.exports = { apps : [{ name: 'rw', script: 'app.js', env: { NODE_ENV: 'production' } }] }

```

发布到服务器

name: Publish And Deploy Demo
on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:

    # 下载源码
    - name: Checkout
      uses: actions/checkout@master

    # 打包构建
    - name: Build
      uses: actions/setup-node@master
    - run: npm install
    - run: npm run build
    - run: tar -zcvf release.tgz .nuxt static nuxt.config.js package.json package-lock.json pm2.config.json
  
    # 发布 Release
    - name: Create Release
      id: create_release
      uses: actions/create-release@master
      env:
        GITHUB_TOKEN: ${{ secrets.TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        draft: false
        prerelease: false

    # 上传构建结果到 Release
    - name: Upload Release Asset
      id: upload-release-asset
      uses: actions/upload-release-asset@master
      env:
        GITHUB_TOKEN: ${{ secrets.TOKEN }}
      with:
        upload_url: ${{ steps.create_release.outputs.upload_url }}
        asset_path: ./release.tgz
        asset_name: release.tgz
        asset_content_type: application/x-tgz

    # 部署到服务器
    - name: Deploy
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        password: ${{ secrets.PASSWORD }}
        port: ${{ secrets.PORT }}
        script: |
          cd /root/realWorld
          wget https://github.com/liuxiaozhen-dot1/fed-e-task-03-03/realWorld/releases/latest/download/release.tgz -O release.tgz
          tar zxvf release.tgz
          npm install --production
          pm2 reload pm2.config.json









