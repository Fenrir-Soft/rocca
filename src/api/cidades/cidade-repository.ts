import PapaParse from 'papaparse'
import type { Cidade } from './cidade'
import { bairro_repository } from '../bairros'
import { zona_repository } from '../zonas'


export class CidadeRepository {
    private records: Map<string, Cidade> = new Map()

    private loading: Promise<void>

    constructor() {
        this.loading = this.load()
    }

    async load() {
        let request = await fetch(`https://www.roccaimob.com.br/data/cidades.csv`)
        if (!request.ok) {
            throw new Error("Não foi possível carregar as cidades")
        }
        let response = await request.text()
        const data = PapaParse.parse<Cidade>(response, {
            header: true
        })




        for (let cidade of data.data) {
            let bairros = await bairro_repository.getByCidadeSlug(cidade.slug)
            let zonas = await zona_repository.getByCidadeSlug(cidade.slug)
            
            this.records.set(cidade.slug, {
                ...cidade,
                zonas,
                bairros
            })
        }
    }

    async getAll(): Promise<Cidade[]> {
        await this.loading
        return Array.from(this.records.values())
    }

    async getBySlug(slug: string) {
        await this.loading
        return this.records.get(slug)
    }


}