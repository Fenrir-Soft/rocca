import PapaParse from "papaparse";
import type { Foto } from "./foto";

export class FotoRepository {
    private records: Map<string, Foto> = new Map()
    private imoveis: Map<string, Foto[]> = new Map()
    private loading: Promise<void>;

    constructor() {
        this.loading = this.load();
    }

    async load() {
        let request = await fetch(
            `https://www.roccaimob.com.br/data/fotos.csv`,
        );
        if (!request.ok) {
            throw new Error("Não foi possível carregar as fotos");
        }
        let response = await request.text();
        const data = PapaParse.parse<Foto>(response, {
            header: true,
        }).data.map((row) => ({
            ...row,
            Ordem: Number(row.Ordem || "0"),
        }));

        for (let row of data) {
            row.ImagemCodigo = `${row.Codigo}.${row.ImagemCodigo}`
            this.records.set(row.ImagemCodigo, row);
            let images = this.imoveis.get(row.Codigo)
            if (!images) {
                images = []
            }
            images.push(row)
            this.imoveis.set(row.Codigo, images)
        }
    }
    async getAll() {
        await this.loading;
        return Array.from(this.records.values());
    }
    async getByCodigo(codigo: string) {
        await this.loading;
        return this.records.get(codigo);
    }
    async getByCodigoImovel(codigo_imovel: string) {
        let records = this.imoveis.get(codigo_imovel)
        if (!records) {
            return []
        }
        let imagens = Array.from(records.values())
        imagens.sort((a, b) => {
            if (a.Destaque === 'Sim') {
                return -1
            }
            if (b.Descricao === 'Sim') {
                return 1
            }
            return a.Ordem < b.Ordem ? -1 : 1
        })
        return imagens
    }
}
