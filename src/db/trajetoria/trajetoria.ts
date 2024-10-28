import type { Selectable } from "kysely";
import type { TrajetoriaTable } from "./trajetoria-table";

export type Trajetoria = Selectable<TrajetoriaTable>