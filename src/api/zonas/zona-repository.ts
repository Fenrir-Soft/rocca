import { bairro_repository, type Bairro } from "../bairros";
import type { Zona } from "./zona";

export class ZonaRepository {
    private records: Map<string, Zona> = new Map();
    private cidades: Map<string, Zona[]> = new Map();

    private loading: Promise<void>;

    constructor() {
        this.loading = this.load();
    }

    async load() {
        let request = await fetch(
            `https://www.roccaimob.com.br/_admin/js-api.php`,
            {
                method: "POST",
                body: new URLSearchParams({
                    method: "getAll",
                    "params[0]":
                        "select id, slug, cidade_slug, titulo, ordenamento from zona where deleted = 0 ORDER BY ordenamento DESC",
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );
        if (!request.ok) {
            throw new Error("Não foi possível carregar as zonas");
        }

        let response = await request.json();
        let rows = response.data as {
            id: string;
            slug: string;
            cidade_slug: string;
            titulo: string;
            ordenamento: string;
        }[];
        let ids = rows.map(({ id }) => id);

        let request2 = await fetch(
            `https://www.roccaimob.com.br/_admin/js-api.php`,
            {
                method: "POST",
                body: new URLSearchParams({
                    method: "getAll",
                    "params[0]": `select id, zona_id, bairro_slug as slug from bairro where deleted = 0 and zona_id IN (${ids.join(",")}) ORDER BY ordenamento DESC`,
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );
        if (!request2.ok) {
            throw new Error("Não foi possível carregar as zonas");
        }
        let response2 = await request2.json();
        let rows2 = response2.data as {
            id: string;
            slug: string;
            zona_id: string;
        }[];

        for (let { id, slug, cidade_slug, titulo, ordenamento } of rows) {
            let bairros_slugs = rows2
                .filter((row) => Number(row.zona_id) === Number(id))
                .map(({ slug }) => slug);

            let bairros: Bairro[] = [];
            for (let bairro_slug of bairros_slugs) {
                let bairro = await bairro_repository.getBySlug(bairro_slug);
                if (bairro) {
                    bairros.push(bairro);
                }
            }

            let record: Zona = {
                id: Number(id),
                slug,
                cidade_slug,
                titulo,
                ordenamento: Number(ordenamento),
                bairros,
            };

            this.records.set(record.slug, record);
            let zonas = this.cidades.get(record.cidade_slug);
            if (!zonas) {
                zonas = [];
            }
            zonas.push(record);
            this.cidades.set(record.cidade_slug, zonas);
        }
    }

    async getAll(): Promise<Zona[]> {
        await this.loading;
        return Array.from(this.records.values());
    }

    async getBySlug(slug: string) {
        await this.loading;
        return this.records.get(slug);
    }

    async getByCidadeSlug(cidade_slug: string) {
        await this.loading;
        let zonas = this.cidades.get(cidade_slug);
        if (!zonas) {
            return [];
        }
        return zonas;
    }
}
