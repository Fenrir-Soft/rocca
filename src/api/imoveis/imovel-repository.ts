import PapaParse from 'papaparse'
import type { Imovel } from "./imovel";

export class ImovelRepository {
    private records: Map<string, Imovel> = new Map()
    private loading: Promise<void>

    constructor() {
        this.loading = this.load()
    }

    async load() {
        let request = await fetch(`https://www.roccaimob.com.br/data/imoveis.csv`)
        if (!request.ok) {
            throw new Error("Não foi possível carregar os imóveis")
        }
        let response = await request.text()
        const data = PapaParse.parse<Imovel>(response, {
            header: true
        })

        for (let row of data.data) {
            this.records.set(row.Codigo, row)
        }
    }
    async getAll() {
        await this.loading
        return Array.from(this.records.values())
    }
    async getByCodigo(codigo: string) {
        await this.loading
        return this.records.get(codigo)
    }
}