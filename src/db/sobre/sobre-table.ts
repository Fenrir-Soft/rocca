import type { DefaultTable } from "../default-table";

export interface SobreTable extends DefaultTable {
    texto: string;
    missao: string;
    visao: string;
    valores: string;
    imagem: string;
}
