import { type Dialect, type Driver, type QueryCompiler, MysqlQueryCompiler, type DialectAdapter, MysqlAdapter, Kysely, type DatabaseIntrospector, MysqlIntrospector } from "kysely"
import { RemoteDriver } from "./remote-driver"

export class RemoteDialect implements Dialect {
    constructor(
        private endpoint: string
    ) { }
    createDriver(): Driver {
        return new RemoteDriver(this.endpoint)
    }
    createQueryCompiler(): QueryCompiler {
        return new MysqlQueryCompiler()
    }
    createAdapter(): DialectAdapter {
        return new MysqlAdapter()
    }
    createIntrospector(db: Kysely<any>): DatabaseIntrospector {
        return new MysqlIntrospector(db)
    }
}