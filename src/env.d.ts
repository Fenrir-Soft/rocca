/// <reference path="../.astro/types.d.ts" />

export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "production" | "development";
            CDN_API_ENDPOINT: string;
            CDN_API_KEY: string;
        }
    }
}
