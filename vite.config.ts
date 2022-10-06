import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from "rollup-plugin-external-globals";
// externalGlobals({
//     react: "React",
//     "react-dom": "ReactDOM",
//     localforage: "localforage",
//     // 非首页载入, 需要异步控制
//     "react-instantsearch-hooks-web": "ReactInstantSearchHooksDOM",
// });
export default defineConfig(({ mode }) => {
    return {
        plugins: [
            solidPlugin(),
            mode === "analyze" &&
                visualizer({ open: true, filename: "visualizer/stat.html" }),
        ],
        server: {
            port: 3000,
        },
        define: {
            // 这是一个特别的 Bug 来源为 @pollyjs 的特殊操作
            ...(mode === "production" ? {} : { global: "globalThis" }),
            __GlobalID__: JSON.stringify("948347934738"),
        },
        resolve: {
            alias: {
                self:
                    mode === "preview"
                        ? "./dist/playground.umd.js"
                        : "./src/index.ts",
                // 修复 global 的问题
                globalThis: "global",
                // "@pollyjs/": "https://cdn.skypack.dev/@pollyjs/",
            },
            // mainFields: ["browser", "module", "jsnext:main", "jsnext"],
        },

        optimizeDeps: {
            esbuildOptions: {
                target: "esnext",
            },
            include: ["lodash-es", "solid-use", "copy-to-clipboard", "buffer"],
        },

        build: {
            target: ["esnext"],
            lib: {
                entry: "./src/index.ts",
                name: "index",
                formats: ["umd"],
            },
            sourcemap: true,
        },
    };
});
