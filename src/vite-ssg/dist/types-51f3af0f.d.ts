import { App } from 'vue';
import { RouteRecordRaw, Router, RouterOptions as RouterOptions$1 } from 'vue-router';
import { HeadClient } from '@vueuse/head';
import { Options } from 'critters';

interface ViteSSGOptions {
    /**
     * Set the scripts' loading mode. Only works for `type="module"`.
     *
     * @default 'sync'
     */
    script?: 'sync' | 'async' | 'defer' | 'async defer';
    /**
     * Build format.
     *
     * @default 'esm'
     */
    format?: 'esm' | 'cjs';
    /**
     * The path of the main entry file (relative to the project root).
     *
     * @default 'src/main.ts'
     */
    entry?: string;
    /**
     * Mock browser global variables (window, document, etc...) for SSG.
     *
     * @default false
     */
    mock?: boolean;
    /**
     * Apply formatter to the generated index file.
     *
     * @default 'none'
     */
    formatting?: 'minify' | 'prettify' | 'none';
    /**
     * Vite environment mode.
     */
    mode?: string;
    /**
     * Directory style of the output directory.
     *
     * flat: `/foo` -> `/foo.html`
     * nested: `/foo` -> `/foo/index.html`
     *
     * @default flat
     */
    dirStyle?: 'flat' | 'nested';
    /**
      * Generate for all routes, including dynamic routes.
      * If enabled, you will need to configure your server
      * manually to handle dynamic routes properly.
      *
      * @default false
      */
    includeAllRoutes?: boolean;
    /**
     * Options for the critters package.
     *
     * @see https://github.com/GoogleChromeLabs/critters
     */
    crittersOptions?: Options | false;
    /**
     * Custom function to modify the routes to do the SSG.
     *
     * Works only when `includeAllRoutes` is set to false.
     *
     * Defaults to a handler that filters out all the dynamic routes.
     * When passing your custom handler, you should also take care of the dynamic routes yourself.
     */
    includedRoutes?: (paths: string[], routes: Readonly<RouteRecordRaw[]>) => Promise<string[]> | string[];
    /**
     * Callback to be called before every page render.
     *
     * It can be used to transform the project's `index.html` file before passing it to the renderer.
     *
     * To do so, you can change the 'index.html' file contents (passed in through the `indexHTML` parameter), and return it.
     * The returned value will then be passed to renderer.
     */
    onBeforePageRender?: (route: string, indexHTML: string, appCtx: ViteSSGContext<true>) => Promise<string | null | undefined> | string | null | undefined;
    /**
     * Callback to be called on every rendered page.
     *
     * It can be used to transform the current route's rendered HTML.
     *
     * To do so, you can transform the route's rendered HTML (passed in through the `renderedHTML` parameter), and return it.
     * The returned value will be used as the HTML of the route.
     */
    onPageRendered?: (route: string, renderedHTML: string, appCtx: ViteSSGContext<true>) => Promise<string | null | undefined> | string | null | undefined;
    onFinished?: () => Promise<void> | void;
    /**
     * The application's root container `id`.
     *
     * @default `app`
     */
    rootContainerId?: string;
    /**
     * The size of the SSG processing queue.
     *
     * @default 20
     */
    concurrency?: number;
}
type PartialKeys<T, Keys extends keyof T> = Omit<T, Keys> & Partial<Pick<T, Keys>>;
interface ViteSSGContext<HasRouter extends boolean = true> {
    app: App<Element>;
    router: HasRouter extends true ? Router : undefined;
    routes: HasRouter extends true ? Readonly<RouteRecordRaw[]> : undefined;
    initialState: Record<string, any>;
    head: HeadClient | undefined;
    isClient: boolean;
    onSSRAppRendered(cb: Function): void;
    triggerOnSSRAppRendered(route: string, appHTML: string, appCtx: ViteSSGContext): Promise<unknown[]>;
    transformState?(state: any): any;
    /**
     * Current router path on SSG, `undefined` on client side.
     */
    routePath?: string;
}
interface ViteSSGClientOptions {
    transformState?: (state: any) => any;
    registerComponents?: boolean;
    useHead?: boolean;
    /**
     * The application's root container query selector.
     *
     * @default `#app`
     */
    rootContainer?: string | Element;
}
type RouterOptions = PartialKeys<RouterOptions$1, 'history'> & {
    base?: string;
};
declare module 'vite' {
    interface UserConfig {
        ssgOptions?: ViteSSGOptions;
    }
}

export { RouterOptions as R, ViteSSGContext as V, ViteSSGClientOptions as a, ViteSSGOptions as b };
