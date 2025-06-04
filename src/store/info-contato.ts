import { db } from "../db";

export const info_contato = await db.selectFrom('infocontato').selectAll().executeTakeFirst()