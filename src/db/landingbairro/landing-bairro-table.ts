import type { DefaultTable } from "../default-table";

export interface LandingBairroTable extends DefaultTable {
    id: number
    uf: string
    cidade: string
    bairro: string    
    bairro_slug: string
    mapa: string
    descricao: string
}
