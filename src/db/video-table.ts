import type { DefaultTable } from "./default-table";

export interface VideoTable extends DefaultTable {
    data: string;
    url: string;
    videoid: string;
    titulo: string;
    duracao: string;
    descricao: string;
    imagem: string;
    content: string;
    galeria: string;
}
