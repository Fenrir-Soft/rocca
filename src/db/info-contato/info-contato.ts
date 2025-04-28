import type { Selectable } from "kysely";
import type { InfoContatoTable } from "./info-contato-table";

export type InfoContato = Selectable<InfoContatoTable>;
