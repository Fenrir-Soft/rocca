import type { Selectable } from "kysely";
import type { BairroTable } from "./bairro-table";

export type Bairro = Selectable<BairroTable>;
