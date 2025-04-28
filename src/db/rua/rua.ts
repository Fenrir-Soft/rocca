import type { Selectable } from "kysely";
import type { RuaTable } from "./rua-table";

export type Rua = Selectable<RuaTable>;
