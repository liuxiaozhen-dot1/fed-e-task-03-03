import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _303a83a1 = () => interopDefault(import('../pages/layout' /* webpackChunkName: "" */))
const _0ef62f16 = () => interopDefault(import('../pages/home' /* webpackChunkName: "" */))
const _5ff007dc = () => interopDefault(import('../pages/login' /* webpackChunkName: "" */))
const _71bfdfdc = () => interopDefault(import('../pages/profile' /* webpackChunkName: "" */))
const _a3bbfa4c = () => interopDefault(import('../pages/settings' /* webpackChunkName: "" */))
const _246ba9e4 = () => interopDefault(import('../pages/editor' /* webpackChunkName: "" */))
const _a42b5942 = () => interopDefault(import('../pages/article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _303a83a1,
    children: [{
      path: "",
      component: _0ef62f16,
      name: "home"
    }, {
      path: "/login",
      component: _5ff007dc,
      name: "login"
    }, {
      path: "/register",
      component: _5ff007dc,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _71bfdfdc,
      name: "profile"
    }, {
      path: "/settings",
      component: _a3bbfa4c,
      name: "settings"
    }, {
      path: "/editor/:slug?",
      component: _246ba9e4,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _a42b5942,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
