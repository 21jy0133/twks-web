import { Component } from 'vue';
import { V as ViteSSGContext, a as ViteSSGClientOptions } from '../types-51f3af0f.js';
export { R as RouterOptions, a as ViteSSGClientOptions, V as ViteSSGContext, b as ViteSSGOptions } from '../types-51f3af0f.js';
import 'vue-router';
import '@vueuse/head';
import 'critters';

declare function ViteSSG(App: Component, fn?: (context: ViteSSGContext<false>) => Promise<void> | void, options?: ViteSSGClientOptions): (client?: boolean) => Promise<ViteSSGContext<false>>;

export { ViteSSG };
