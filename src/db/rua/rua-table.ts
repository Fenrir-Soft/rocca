import type { DefaultTable } from "../default-table";

export interface RuaTable extends DefaultTable {
    id: number
    uf: string
    cidade: string
    bairro: string
    rua: string
    rua_slug: string
    mapa: string
    descricao: string
}
