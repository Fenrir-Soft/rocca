import type { DefaultTable } from "../default-table";

export interface LandingBairroArquivoTable extends DefaultTable {
    id: number
    ordenamento: number
    landingbairro_id: number
    arquivo: string
    titulo: string
    legenda: string
    galeria: string
    ext: string
    size: number
    path: string
    destaque: boolean
}
