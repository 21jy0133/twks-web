import { createApp, createSSRApp } from 'vue';
import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router';
import { createHead } from '@vueuse/head';
import { d as deserializeState } from './shared/vite-ssg.a009fbf1.mjs';
import { C as ClientOnly, d as documentReady } from './shared/vite-ssg.5912142e.mjs';

function ViteSSG(App, routerOptions, fn, options = {}) {
  const {
    transformState,
    registerComponents = true,
    useHead = true,
    rootContainer = "#app"
  } = options;
  const isClient = typeof window !== "undefined";
  async function createApp$1(client = false, routePath) {
    const app = client ? createApp(App) : createSSRApp(App);
    let head;
    if (useHead) {
      head = createHead();
      app.use(head);
    }
    const router = createRouter({
      history: client ? createWebHashHistory(routerOptions.base) : createMemoryHistory(routerOptions.base),
      ...routerOptions
    });
    const { routes } = routerOptions;
    if (registerComponents)
      app.component("ClientOnly", ClientOnly);
    const appRenderCallbacks = [];
    const onSSRAppRendered = client ? () => {
    } : (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      app,
      head,
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
      await documentReady();
      context.initialState = transformState?.(window.__INITIAL_STATE__ || {}) || deserializeState(window.__INITIAL_STATE__);
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
      const { app, router } = await createApp$1(true);
      await router.isReady();
      app.mount(rootContainer, true);
    })();
  }
  return createApp$1;
}

export { ViteSSG };
