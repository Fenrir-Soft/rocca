import PapaParse from "papaparse";

import type { ImovelInfraestrutura } from "./imovel-infraestrutura";

export class ImovelInfraestruturaRepository {
    private records: Map<string, ImovelInfraestrutura> = new Map();
    private loading: Promise<void>;

    constructor() {
        this.loading = this.load();
    }

    async load() {
        let request = await fetch(
            `https://www.roccaimob.com.br/data/infra_estrutura_imovel.csv`,
        );
        if (!request.ok) {
            throw new Error("Não foi possível carregar as características");
        }
        let response = await request.text();
        const data = PapaParse.parse<ImovelInfraestrutura>(response, {
            header: true,
        });

        for (let row of data.data) {
            this.records.set(row.Codigo, row);
        }
    }
    async getAll() {
        await this.loading;
        return Array.from(this.records.values());
    }
    async getByCodigo(codigo: string): Promise<ImovelInfraestrutura> {
        await this.loading;
        let records = this.records.get(codigo);
        if (records === undefined) {
            return {
                Codigo: codigo
            }
        }
        return records
    }
}
