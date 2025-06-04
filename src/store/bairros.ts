import { db } from "../db"
import type { LandingBairroArquivo } from "../db/landingbairroarquivo";
import type { LandingBairro } from "../db/landingbairro";

export const landing_bairros: Map<string, LandingBairro> = new Map()
export const landing_bairros_arquivos: Map<number, LandingBairroArquivo[]> = new Map()

const rows = await db.selectFrom('landingbairro').selectAll().execute()


for (let row of rows) {
    landing_bairros.set(row.bairro_slug, row)
}


let records = await db.selectFrom('landingbairroarquivo').selectAll()
    .where('galeria', '=', 'imagens')
    .execute()

for (let row of records) {
    let arquivos = landing_bairros_arquivos.get(row.landingbairro_id)
    if (!arquivos) {
        arquivos = []
    }
    arquivos.push(row)
    landing_bairros_arquivos.set(row.landingbairro_id, arquivos)
}