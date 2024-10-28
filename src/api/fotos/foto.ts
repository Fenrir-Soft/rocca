export type Foto = {
    Codigo: string;
    Ordem: number;
    ImagemCodigo: string;
    Data: string;
    Descricao: string;
    Destaque: "Sim" | "Nao";
    ExibirNoSite: "Sim" | "Nao";
    Foto: string;
    FotoPequena: string;
    Tipo: string;
};
