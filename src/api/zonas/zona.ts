import type { Bairro } from "../bairros"

export type Zona = {
    id: number
    slug: string
    titulo: string
    cidade_slug: string    
    ordenamento: number
    bairros: Bairro[]
}