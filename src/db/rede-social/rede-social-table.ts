import type { DefaultTable } from "../default-table";

export interface RedeSocialTable extends DefaultTable {
    icone: string
    titulo: string
    link: string
    ativo: boolean
    slug: string
}