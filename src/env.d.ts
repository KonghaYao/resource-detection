/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly PUBLIC_BACKEND: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
