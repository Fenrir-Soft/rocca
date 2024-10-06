import type { CategoriaTipo } from "./categoria-tipo";

export class CategoriaTipoRepository {
    private records: CategoriaTipo[] = []

    private loading: Promise<void>

    constructor() {
        this.loading = this.load()
    }

    async load() {
        let request = await fetch(`https://www.roccaimob.com.br/_admin/js-api.php`, {
            method: 'POST',
            body: new URLSearchParams({
                method: 'getAll',
                'params[0]': 'select id, slug, titulo, tipos, ordenamento from categoriatipo where deleted = 0 ORDER BY ordenamento DESC'
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if (!request.ok) {
            throw new Error("Não foi possível carregar as categorias de tipos")
        }

        let response = await request.json()
        let rows = response.data
        for (let row of rows) {
            let record: CategoriaTipo = {
                ...row,
                id: Number(row.id),
                ordenamento: Number(row.ordenamento),
                tipos: (row.tipos as string).split('|').filter(t => t.trim() != '')
            }
          
            

            this.records.push(record)
            
        }
    }

    async getAll(): Promise<CategoriaTipo[]> {
        await this.loading
        return this.records
    }


}