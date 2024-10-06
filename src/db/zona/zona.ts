import type { Selectable } from "kysely";
import type { ZonaTable } from "./zona-table";

export type Zona = Selectable<ZonaTable>