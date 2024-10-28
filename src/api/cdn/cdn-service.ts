import type { CdnImage } from "./cdn-image";
import probe from "probe-image-size";

export class CdnService {
    private cache: Map<string, CdnImage> = new Map();
    constructor(
        private endpoint: string,
        private key: string,
    ) {}

    async save(record: CdnImage): Promise<CdnImage> {
        try {
            const cache_key = `${record.bucket}/${record.hash}/${record.url}`;
            const cache = this.cache.get(cache_key);
            if (cache) {
                return cache;
            }
            console.log(cache_key);
            const info = await probe(record.url);
            record.width = info.width;
            record.height = info.height;
            record.type = info.mime;

            const response = await fetch(
                `${this.endpoint}/${record.bucket}/${record.hash}/${record.id}.jpg`,
                {
                    method: "POST",
                    body: JSON.stringify(record),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.key}`,
                    },
                },
            );
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const item = (await response.json()) as CdnImage;
            this.cache.set(cache_key, item);
            return item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
