import { CdnService } from "./cdn-service";

export * from "./cdn-image";
export * from "./cdn-service";

export const cdn_service = new CdnService(
    Bun.env.CDN_API_ENDPOINT,
    Bun.env.CDN_API_KEY,
);

await cdn_service.search().then(rows => {})