import PapaParse from "papaparse";
import type { Bairro } from "./bairro";

export class BairroRepository {
    private records: Map<string, Bairro> = new Map();
    private cidades: Map<string, Bairro[]> = new Map();

    private loading: Promise<void>;

    constructor() {
        this.loading = this.load();
    }

    async load() {
        let request = await fetch(
            `https://www.roccaimob.com.br/data/bairros.csv`,
        );
        if (!request.ok) {
            throw new Error("Não foi possível carregar os bairros");
        }
        let response = await request.text();
        const data = PapaParse.parse<Bairro>(response, {
            header: true,
        });

        for (let bairro of data.data) {
            this.records.set(bairro.slug, bairro);
            
            let bairros = this.cidades.get(bairro.cidade_slug);
            if (!bairros) {
                bairros = [];
            }
            bairros.push(bairro);
            this.cidades.set(bairro.cidade_slug, bairros);
        }
    }

    async getAll(): Promise<Bairro[]> {
        await this.loading;
        return Array.from(this.records.values());
    }

    async getBySlug(slug: string) {
        await this.loading;
        return this.records.get(slug);
    }

    async getByCidadeSlug(cidade_slug: string) {
        await this.loading;
        let bairros = this.cidades.get(cidade_slug);
        if (!bairros) {
            return [];
        }
        return bairros;
    }
}
