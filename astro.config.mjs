// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";

import vue from "@astrojs/vue";

// https://astro.build/config

export default defineConfig({
    integrations: [icon(), vue()],
    image: {
        remotePatterns: [{ protocol: "https" }],
    },
    cacheDir: ".cache",
    //base: Bun.env.NODE_ENV === "production" ? "clientes/rocca/" : "/",
    //base: Bun.env.NODE_ENV === "production" ? "/" : "/",
    base: Bun.env.BASE_URL,
    experimental: {
        //contentCollectionCache: true,
    },
});