import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
    plugins: [solidPlugin()],
    server: {
        port: 3000,
    },
    define: {
        global: "globalThis",
        __GlobalID__: JSON.stringify("948347934738"),
    },
    resolve: {
        alias: {
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
        cssCodeSplit: false,
        lib: {
            entry: "./src/index.ts",
            name: "index",
            formats: ["umd"],
        },
        sourcemap: true,
    },
    test: {
        environment: "happy-dom",
    },
});
