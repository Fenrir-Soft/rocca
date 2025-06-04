import { db } from "../db"
import type { Rua } from "../db/rua";
import type { RuaArquivo } from "../db/ruaarquivo";


export const ruas: Map<string, Rua> = new Map()
export const ruas_arquivos: Map<number, RuaArquivo[]> = new Map()

const rows = await db.selectFrom('rua').selectAll().execute()


for (let row of rows) {
    ruas.set(row.rua_slug, row)
}


let records = await db.selectFrom('ruaarquivo').selectAll()
    .execute()

for (let row of records) {
    let arquivos = ruas_arquivos.get(row.rua_id)
    if (!arquivos) {
        arquivos = []
    }
    arquivos.push(row)
    ruas_arquivos.set(row.rua_id, arquivos)
}