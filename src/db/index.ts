import { Kysely } from "kysely";
import type { CondominioGrupoTable } from "./condominio-grupo";
import { RemoteDialect } from "../lib/remote-db";
import type { CondominioGrupoArquivoTable } from "./condominio-grupo-arquivo/condominio-grupo-arquivo-table";
import type { CondominioGrupoVideoTable } from "./condominio-grupo-video/condominio-grupo-video-table";
import type { CategoriaTipoTable } from "./categoria-tipo";
import type { BairroTable } from "./bairro";
import type { ZonaTable } from "./zona";
import type { PoliticaPrivacidadeTable } from "./politica-privacidade";
import type { SobreTable } from "./sobre";
import type { ImovelComplementoTable } from "./imovel-complemento";
import type { ImovelTagTable } from "./imovel-tag";
import type { TagImovelTable } from "./tag-imovel";
import type { RedeSocialTable } from "./rede-social";
import type { TrajetoriaTable } from "./trajetoria";

export * from "./condominio-grupo";

export interface Database {
    bairro: BairroTable;
    categoriatipo: CategoriaTipoTable;
    condominiogrupo: CondominioGrupoTable;
    condominiogrupoarquivo: CondominioGrupoArquivoTable;
    condominiogrupovideo: CondominioGrupoVideoTable;
    imovelcomplemento: ImovelComplementoTable;
    imoveltag: ImovelTagTable;
    politicaprivacidade: PoliticaPrivacidadeTable;
    redesocial: RedeSocialTable;
    sobre: SobreTable;
    tagimovel: TagImovelTable;
    zona: ZonaTable;
    trajetoria: TrajetoriaTable
}

export const db = new Kysely<Database>({
    dialect: new RemoteDialect(
        `https://www.roccaimob.com.br/_admin/js-api.php`,
    ),
});
