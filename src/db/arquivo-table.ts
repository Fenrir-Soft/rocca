import type { DefaultTable } from "./default-table";

export interface ArquivoTable extends DefaultTable {
    arquivo: string;
    titulo: string;
    legenda: string;
    galeria: string;
    destaque: boolean;
    ext: string;
    size: number;
    path: string;
    orientacao: string;
}
