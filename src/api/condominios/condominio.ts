export type Condominio = {
    id: number
    slug: string
    titulo: string
    nome_condominio: string
    diferenciais: string[]
    descricao: string
    cep: string
    uf: string
    cidade: string
    bairro: string
    latitude: number
    longitude: number
    apresentacao_dos_imoveis: string
    footer: boolean
    meta_title: string
    meta_description: string
}