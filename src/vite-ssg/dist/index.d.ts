import { Component } from 'vue';
import { R as RouterOptions, V as ViteSSGContext, a as ViteSSGClientOptions } from './types-51f3af0f.js';
export { R as RouterOptions, a as ViteSSGClientOptions, V as ViteSSGContext, b as ViteSSGOptions } from './types-51f3af0f.js';
import 'vue-router';
import '@vueuse/head';
import 'critters';

declare function ViteSSG(App: Component, routerOptions: RouterOptions, fn?: (context: ViteSSGContext<true>) => Promise<void> | void, options?: ViteSSGClientOptions): (client?: boolean, routePath?: string) => Promise<ViteSSGContext<true>>;

export { ViteSSG };
