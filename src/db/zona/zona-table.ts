import type { DefaultTable } from "../default-table";

export interface ZonaTable extends DefaultTable {
    titulo: string
    slug: string
    cidade_slug: string
}