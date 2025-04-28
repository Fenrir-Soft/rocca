import type { DefaultTable } from "../default-table";

export interface InfoContatoTable extends DefaultTable {
    id: number
    whatsapp: string
    email: string
    texto_footer: string
    onde_estamos: string
    central_vendas_locacao: string
    tiposimovel: string
    texto_quero_vender_meu_imovel: string
    texto_quero_alugar_meu_imovel: string
}
