// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config

export default defineConfig({
    integrations: [icon()],
    image: {
        remotePatterns: [{ protocol: "https" }],
    },
    cacheDir: ".cache",
    base: Bun.env.NODE_ENV === "production" ? "clientes/rocca/" : "/",
    experimental: {
        //contentCollectionCache: true,
    },
});
