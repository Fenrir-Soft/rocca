import type { DefaultTable } from "../default-table";

export interface FaixaValorTable extends DefaultTable {
    finalidade: string
    valor: number
}
