import type { DefaultTable } from "../default-table";

export interface RuaArquivoTable extends DefaultTable {
    id: number
    ordenamento: number
    rua_id: number
    arquivo: string
    titulo: string
    legenda: string
    galeria: string
    ext: string
    size: number
    path: string
    destaque: boolean
}
