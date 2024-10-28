export type CondominioArquivo = {
    id: number;
    condominio_id: number;
    titulo: string;
    size: number;
    path: string | any;
    destaque: boolean;
    ext: string;
    galeria: string;
    legenda: string;
    ordenamento: number;
    orientacao: "vertical" | "orizontal";
};
