
import type { CondominioArquivo } from "./condominio-arquivo";

//import path from 'path'
//const image_folder = path.resolve('src/assets/images')

const downloadImage = async (arquivo: CondominioArquivo) => {
    return `https://www.roccaimob.com.br/_files/${arquivo.path}`
}

export class CondominioArquivoRepository {
    private records: Map<number, CondominioArquivo[]> = new Map()


    private loading: Promise<void>

    constructor() {
        this.loading = this.load()
    }

    async load() {
        let request = await fetch(`https://www.roccaimob.com.br/_admin/js-api.php`, {
            method: 'POST',
            body: new URLSearchParams({
                method: 'getAll',
                'params[0]': 'select * from condominiogrupoarquivo where deleted = 0'
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if (!request.ok) {
            throw new Error("Não foi possível carregar os arquivos dos condominios")
        }

        let response = await request.json()
        let rows = response.data
        for (let row of rows) {
            let record: CondominioArquivo = {
                ...row,
                id: Number(row.id),
                condominio_id: Number(row.condominiogrupo_id),
                size: Number(row.size),
                destaque: 1 === Number(row.destaque),
                ordenamento: Number(row.ordenamento)
            }
            let arquivos = this.records.get(record.condominio_id)
            if (!arquivos) {
                arquivos = []
            }

            record.path = await downloadImage(record)
            arquivos.push(record)
            this.records.set(record.condominio_id, arquivos)
            downloadImage(record)

            
        }
    }

    async getByCondominioId(condominio_id: number): Promise<CondominioArquivo[]> {
        await this.loading;
        const arquivos = this.records.get(condominio_id)
        if (!arquivos) {
            return []
        }
        return arquivos
    }


}