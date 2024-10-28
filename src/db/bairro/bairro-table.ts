import type { DefaultTable } from "../default-table";

export interface BairroTable extends DefaultTable {
    zona_id: number;
    titulo: string;
    bairro_slug: string;
}
