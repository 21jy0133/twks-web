'use strict';

const vue = require('vue');
const vueRouter = require('vue-router');
const head = require('@vueuse/head');
const state = require('./shared/vite-ssg.e6991406.cjs');
const ClientOnly = require('./shared/vite-ssg.0250a125.cjs');

function ViteSSG(App, routerOptions, fn, options = {}) {
  const {
    transformState,
    registerComponents = true,
    useHead = true,
    rootContainer = "#app"
  } = options;
  const isClient = typeof window !== "undefined";
  async function createApp(client = false, routePath) {
    const app = client ? vue.createApp(App) : vue.createSSRApp(App);
    let head$1;
    if (useHead) {
      head$1 = head.createHead();
      app.use(head$1);
    }
    const router = vueRouter.createRouter({
      history: client ? vueRouter.createWebHashHistory(routerOptions.base) : vueRouter.createMemoryHistory(routerOptions.base),
      ...routerOptions
    });
    const { routes } = routerOptions;
    if (registerComponents)
      app.component("ClientOnly", ClientOnly.ClientOnly);
    const appRenderCallbacks = [];
    const onSSRAppRendered = client ? () => {
    } : (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      app,
      head: head$1,
      isClient,
      router,
      routes,
      onSSRAppRendered,
      triggerOnSSRAppRendered,
      initialState: {},
      transformState,
      routePath
    };
    if (client) {
      await ClientOnly.documentReady();
      context.initialState = transformState?.(window.__INITIAL_STATE__ || {}) || state.deserializeState(window.__INITIAL_STATE__);
    }
    await fn?.(context);
    app.use(router);
    let entryRoutePath;
    let isFirstRoute = true;
    router.beforeEach((to, from, next) => {
      if (isFirstRoute || entryRoutePath && entryRoutePath === to.path) {
        isFirstRoute = false;
        entryRoutePath = to.path;
        to.meta.state = context.initialState;
      }
      next();
    });
    if (!client) {
      const route = context.routePath ?? "/";
      router.push(route);
      await router.isReady();
      context.initialState = router.currentRoute.value.meta.state || {};
    }
    const initialState = context.initialState;
    return {
      ...context,
      initialState
    };
  }
  if (isClient) {
    (async () => {
      const { app, router } = await createApp(true);
      await router.isReady();
      app.mount(rootContainer, true);
    })();
  }
  return createApp;
}

exports.ViteSSG = ViteSSG;
