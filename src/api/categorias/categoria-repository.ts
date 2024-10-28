import PapaParse from "papaparse";
import type { Categoria } from "./categoria";

export class CategoriaRepository {
    private records: Map<string, Categoria> = new Map();

    private loading: Promise<void>;

    constructor() {
        this.loading = this.load();
    }

    async load() {
        let request = await fetch(
            `https://www.roccaimob.com.br/data/categorias.csv`,
        );
        if (!request.ok) {
            throw new Error("Não foi possível carregar as categorias");
        }
        let response = await request.text();
        const data = PapaParse.parse<Categoria>(response, {
            header: true,
        });

        for (let row of data.data) {
            this.records.set(row.slug, row);
        }
    }

    async getAll(): Promise<Categoria[]> {
        await this.loading;
        return Array.from(this.records.values());
    }

    async getBySlug(slug: string) {
        await this.loading;
        return this.records.get(slug);
    }
}
