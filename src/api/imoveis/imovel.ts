export type Imovel = {
    Codigo: string;
    Categoria: string;
    Empreendimento: string;
    Condominio: string;
    ValorVenda: number;
    ValorVendaDe: number;
    ValorVendaPor: number;
    ValorLocacao: number;
    ValorLocacaoDe: number;
    ValorLocacaoPor: number;
    ValorVendaPadrao: number;
    ValorM2: number;
    ValorCondominio: number;
    ValorIptu: number;
    UF: string;
    Cidade: string;
    Bairro: string;
    BairroComercial: string;
    Endereco: string
    Numero: string
    Complemento: string
    CEP: string
    AreaTotal: number;
    AreaPrivativa: number;
    Dormitorios: number;
    Suites: number;
    Vagas: number;
    BanheiroSocialQtd: number;
    FotoDestaque: string;
    FotoDestaquePequena: string;
    EEmpreendimento: "Sim" | "Nao";
    Status: string;
    Mobiliaddo: "Sim" | "Nao";
    SemiMobiliado: "Sim" | "Nao";
    Situacao: string;
    DestaqueWeb: "Sim" | "Nao";
    SuperDestaqueWeb: "Sim" | "Nao";
    DescricaoWeb: string;
};
