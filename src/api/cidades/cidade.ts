import type { Bairro } from "../bairros";
import type { Zona } from "../zonas";

export type Cidade = {
    UF: string;
    Cidade: string;
    slug: string;
    zonas: Zona[];
    bairros: Bairro[];
};
