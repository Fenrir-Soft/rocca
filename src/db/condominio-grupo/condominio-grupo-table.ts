import type { DefaultTable } from "../default-table";

export interface CondominioGrupoTable extends DefaultTable {
    slug: string;
    titulo: string;
    nome_condominio: string;
    cep: string;
    uf: string;
    cidade: string;
    bairro: string;
    latitude: number;
    longitude: number;
    diferenciais: string;
    descricao: string;
    apresentacao_imoveis: string;
    footer: boolean;
    meta_title?: string;
    meta_description?: string;
}
