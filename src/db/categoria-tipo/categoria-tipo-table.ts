import type { DefaultTable } from "../default-table";

export interface CategoriaTipoTable extends DefaultTable {
    titulo: string;
    tipos: string;
    slug: string;
}
